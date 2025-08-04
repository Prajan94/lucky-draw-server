// db.js
const { Pool } = require('pg');

// ⚠ Replace values as per your setup
const pool = new Pool({
  user: 'luckydraw_user',
  host: 'localhost',
  database: 'luckydraw',
  password: '*****',
  port: 5432,
});

module.exports = pool;
