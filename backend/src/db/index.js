const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => {
  console.error('Unexpected DB error', err);
});

// Returns all org_unit IDs in the subtree rooted at unitId (inclusive)
async function getSubtreeIds(unitId) {
  const result = await pool.query(`
    WITH RECURSIVE subtree AS (
      SELECT id FROM org_units WHERE id = $1
      UNION ALL
      SELECT o.id FROM org_units o JOIN subtree s ON o.parent_id = s.id
    )
    SELECT id FROM subtree
  `, [unitId]);
  return result.rows.map(r => r.id);
}

module.exports = { pool, getSubtreeIds };
