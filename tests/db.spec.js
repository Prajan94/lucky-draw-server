const pool = require('../config/db-config');

describe('DB Pool', () => {
  it('should have expected config properties', () => {
    expect(pool.options).toMatchObject({
      user: expect.any(String),
      host: expect.any(String),
      database: expect.any(String),
      port: expect.any(Number),
    });
  });

  it('should be able to run a simple query', async () => {
    const result = await pool.query('SELECT 1+1 AS sum');
    expect(result.rows[0].sum).toBe(2);
  });
});