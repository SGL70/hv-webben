const express = require('express');
const { pool, getSubtreeIds } = require('../db/index');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/reports — my reports + reports pending my action
router.get('/', async (req, res) => {
  const { filter } = req.query; // 'mine' | 'review' | 'approve'
  let query, params;

  if (filter === 'review') {
    // PC: submitted reports from my unit
    const ids = await getSubtreeIds(req.user.org_unit_id);
    query = `SELECT r.*, u.name AS user_name FROM reports r
             JOIN users u ON u.id = r.user_id
             WHERE r.status='submitted' AND u.org_unit_id = ANY($1) ORDER BY r.report_date DESC`;
    params = [ids];
  } else if (filter === 'approve') {
    // KompCh: reviewed reports from my unit
    const ids = await getSubtreeIds(req.user.org_unit_id);
    query = `SELECT r.*, u.name AS user_name FROM reports r
             JOIN users u ON u.id = r.user_id
             WHERE r.status='reviewed' AND u.org_unit_id = ANY($1) ORDER BY r.report_date DESC`;
    params = [ids];
  } else {
    // My own reports
    query = `SELECT r.*, a.title AS activity_title FROM reports r
             LEFT JOIN activities a ON a.id = r.activity_id
             WHERE r.user_id=$1 ORDER BY r.report_date DESC`;
    params = [req.user.id];
  }

  const result = await pool.query(query, params);
  res.json(result.rows);
});

// POST /api/reports — create
router.post('/', async (req, res) => {
  const { activity_id, report_date, hours, km, expenses, expense_description, description } = req.body;
  const result = await pool.query(
    `INSERT INTO reports (user_id,activity_id,report_date,hours,km,expenses,expense_description,description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, activity_id || null, report_date, hours || 0, km || 0,
     expenses || 0, expense_description || null, description || null]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/reports/:id — update (own draft only)
router.put('/:id', async (req, res) => {
  const { hours, km, expenses, expense_description, description, report_date } = req.body;
  const result = await pool.query(
    `UPDATE reports SET hours=$1,km=$2,expenses=$3,expense_description=$4,
     description=$5,report_date=$6,updated_at=NOW()
     WHERE id=$7 AND user_id=$8 AND status='draft' RETURNING *`,
    [hours, km, expenses, expense_description, description, report_date, req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

// POST /api/reports/:id/submit
router.post('/:id/submit', async (req, res) => {
  const result = await pool.query(
    `UPDATE reports SET status='submitted', updated_at=NOW()
     WHERE id=$1 AND user_id=$2 AND status='draft' RETURNING *`,
    [req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

// POST /api/reports/:id/review — PC reviews (approve/return)
router.post('/:id/review', requireRole('pc'), async (req, res) => {
  const { action } = req.body; // 'approve' | 'return'
  const newStatus = action === 'approve' ? 'reviewed' : 'draft';
  const result = await pool.query(
    `UPDATE reports SET status=$1, reviewed_by=$2, reviewed_at=NOW(), updated_at=NOW()
     WHERE id=$3 AND status='submitted' RETURNING *`,
    [newStatus, req.user.id, req.params.id]
  );
  if (!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

// POST /api/reports/:id/approve — KompCh attests
router.post('/:id/approve', requireRole('kompc'), async (req, res) => {
  const { action } = req.body; // 'approve' | 'return'
  const newStatus = action === 'approve' ? 'approved' : 'submitted';
  const result = await pool.query(
    `UPDATE reports SET status=$1, approved_by=$2, approved_at=NOW(), updated_at=NOW()
     WHERE id=$3 AND status='reviewed' RETURNING *`,
    [newStatus, req.user.id, req.params.id]
  );
  if (!result.rows.length) return res.status(403).json({ error: 'Not allowed' });
  res.json(result.rows[0]);
});

module.exports = router;
