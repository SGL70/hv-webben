const express = require('express');
const { pool, getSubtreeIds } = require('../db/index');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// GET /api/orgs — full tree
router.get('/', async (_req, res) => {
  const units = await pool.query('SELECT * FROM org_units ORDER BY type, name');
  res.json(units.rows);
});

// GET /api/orgs/:id/members
router.get('/:id/members', async (req, res) => {
  const ids = await getSubtreeIds(req.params.id);
  const result = await pool.query(
    `SELECT u.id, u.name, u.role, u.email, u.mobile, u.profile_complete,
            u.org_unit_id, o.name AS unit_name
     FROM users u LEFT JOIN org_units o ON o.id = u.org_unit_id
     WHERE u.org_unit_id = ANY($1) ORDER BY u.name`,
    [ids]
  );
  res.json(result.rows);
});

// POST /api/orgs — create unit (S4+)
router.post('/', requireRole('s4'), async (req, res) => {
  const { name, type, parent_id } = req.body;
  const result = await pool.query(
    'INSERT INTO org_units (name, type, parent_id) VALUES ($1,$2,$3) RETURNING *',
    [name, type, parent_id || null]
  );
  res.status(201).json(result.rows[0]);
});

// PUT /api/orgs/:id (S4+)
router.put('/:id', requireRole('s4'), async (req, res) => {
  const { name, parent_id } = req.body;
  const result = await pool.query(
    'UPDATE org_units SET name=$1, parent_id=$2 WHERE id=$3 RETURNING *',
    [name, parent_id || null, req.params.id]
  );
  res.json(result.rows[0]);
});

// DELETE /api/orgs/:id (S4+)
router.delete('/:id', requireRole('s4'), async (req, res) => {
  await pool.query('DELETE FROM org_units WHERE id=$1', [req.params.id]);
  res.status(204).end();
});

// POST /api/orgs/:id/members — add member by personnummer (grpc+)
router.post('/:id/members', requireRole('grpc'), async (req, res) => {
  const { personal_number, role = 'soldat' } = req.body;
  const unitId = parseInt(req.params.id);

  // Check if user already exists
  const existing = await pool.query(
    'SELECT id FROM users WHERE personal_number=$1', [personal_number]
  );
  if (existing.rows.length) {
    // Move existing user to this unit
    const updated = await pool.query(
      'UPDATE users SET org_unit_id=$1, role=$2 WHERE personal_number=$3 RETURNING *',
      [unitId, role, personal_number]
    );
    return res.json({ status: 'moved', user: updated.rows[0] });
  }

  // Pre-register: add to pending_members, matched on first BankID login
  await pool.query(
    `INSERT INTO pending_members (personal_number, org_unit_id, role, added_by)
     VALUES ($1,$2,$3,$4) ON CONFLICT (personal_number)
     DO UPDATE SET org_unit_id=$2, role=$3`,
    [personal_number, unitId, role, req.user.id]
  );
  res.status(201).json({ status: 'pending', personal_number });
});

// DELETE /api/orgs/:id/members/:userId (grpc+)
router.delete('/:id/members/:userId', requireRole('grpc'), async (req, res) => {
  await pool.query(
    'UPDATE users SET org_unit_id=NULL WHERE id=$1 AND org_unit_id=$2',
    [req.params.userId, req.params.id]
  );
  res.status(204).end();
});

// PUT /api/orgs/:id/members/:userId/role — set role (pc assigns grpc, etc.)
router.put('/:id/members/:userId/role', requireRole('grpc'), async (req, res) => {
  const { role } = req.body;
  const result = await pool.query(
    'UPDATE users SET role=$1 WHERE id=$2 RETURNING *',
    [role, req.params.userId]
  );
  res.json(result.rows[0]);
});

module.exports = router;
