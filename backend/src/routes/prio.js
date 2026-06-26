const express = require('express');
const multer  = require('multer');
const XLSX    = require('xlsx');
const { pool, getSubtreeIds } = require('../db/index');
const { requireAuth, requireLogistics } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Map 4-digit M-prefix → category
const CAT_MAP = {
  '1150': 'Identitet',
  '2311': 'CBRN',
  '2740': 'Fältmateriel', '2760': 'Fältmateriel', '2824': 'Fältmateriel',
  '4800': 'Vapentillbehör',
  '6310': 'Verktyg', '6426': 'Verktyg',
  '7061': 'Dricka', '7062': 'Dricka',
  '7080': 'Fältmateriel',
  '7085': 'Bärande system',
  '7313': 'Sovsystem', '7317': 'Sovsystem',
  '7320': 'Fältuniform',
  '7321': 'Underkläder', '7322': 'Underkläder', '7323': 'Underkläder',
  '7330': 'Handskar', '7331': 'Handskar', '7332': 'Handskar',
  '7335': 'Skodon', '7336': 'Skodon', '7337': 'Skodon',
  '7340': 'Optik & hörsel', '7343': 'Optik & hörsel',
  '7345': 'Tjänstedräkt',
  '7346': 'Huvudbonader', '7347': 'Huvudbonader',
  '7351': 'Tjänstedräkt', '7352': 'Fältuniform',
  '7355': 'Ytterkläder', '7360': 'Ytterkläder', '7370': 'Ytterkläder',
  '7372': 'Ytterkläder', '7373': 'Ytterkläder', '7379': 'Ytterkläder',
  '7388': 'Knäskydd',
  '7390': 'Bärande system',
  '7510': 'Hygien',
  '7674': 'Tjänstedräkt',
  '8286': 'Skyddsutrustning', '8560': 'Skyddsutrustning', '8570': 'Skyddsutrustning',
  '8610': 'Hygien',
};

function categorize(art) {
  const m = art && String(art).match(/^M(\d{4})/);
  return m ? (CAT_MAP[m[1]] || 'Övrigt') : 'Övrigt';
}

function parseRows(buffer) {
  const wb = XLSX.read(buffer);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

  const items = [];
  let prioName = null;

  for (const row of rows) {
    const art = row[2];
    if (!art || !String(art).startsWith('M')) continue;
    if (!prioName && row[0] && row[0] !== 'Förnamn') {
      prioName = `${row[0]} ${row[1] || ''}`.trim();
    }
    items.push({
      article_number: String(art).trim(),
      name:           String(row[3] || '').trim(),
      quantity:       parseInt(row[4]) || 1,
      unit:           String(row[5] || 'ST').trim(),
      category:       categorize(String(art)),
    });
  }

  return { items, prioName };
}

// POST /api/prio/parse — preview without DB writes (kvm+)
router.post('/parse', requireLogistics, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Ingen fil uppladdad' });
  try {
    const { items, prioName } = parseRows(req.file.buffer);
    res.json({ items, prio_name: prioName, count: items.length });
  } catch (err) {
    res.status(400).json({ error: 'Kunde inte läsa xlsx: ' + err.message });
  }
});

// POST /api/prio/import — import for a specific user (kvm+)
router.post('/import', requireLogistics, upload.single('file'), async (req, res) => {
  const { user_id } = req.body;
  if (!req.file) return res.status(400).json({ error: 'Ingen fil uppladdad' });
  if (!user_id)  return res.status(400).json({ error: 'user_id saknas' });

  // KVM lives in Kompanistab — scope up to parent Kompani
  let scopeId = req.user.org_unit_id;
  if (req.user.role === 'kvm') {
    const r = await pool.query('SELECT parent_id FROM org_units WHERE id=$1', [scopeId]);
    scopeId = r.rows[0]?.parent_id ?? scopeId;
  }
  const subtree = await getSubtreeIds(scopeId);
  const check = await pool.query(
    'SELECT id, name FROM users WHERE id=$1 AND org_unit_id = ANY($2)',
    [user_id, subtree]
  );
  if (!check.rows.length) return res.status(403).json({ error: 'Forbidden' });

  let { items } = parseRows(req.file.buffer);
  let created = 0, skipped = 0;

  for (const it of items) {
    const r = await pool.query(
      `INSERT INTO equipment (user_id, article_number, name, quantity, category, unit, source)
       VALUES ($1,$2,$3,$4,$5,$6,'prio')
       ON CONFLICT (user_id, article_number) DO NOTHING`,
      [user_id, it.article_number, it.name, it.quantity, it.category, it.unit]
    );
    if (r.rowCount > 0) created++;
    else skipped++;
  }

  res.json({ created, skipped, user_name: check.rows[0].name });
});

module.exports = router;
