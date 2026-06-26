const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { pool } = require('./index');

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed   = fs.readFileSync(path.join(__dirname, 'seed.sql'),   'utf8');
  try {
    await pool.query(schema);
    console.log('Schema created');
    await pool.query(seed);
    console.log('Seed data inserted');
  } catch (e) {
    console.error('DB init error:', e.message);
  } finally {
    await pool.end();
  }
}

init();
