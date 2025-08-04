const request = require('supertest');
const { createApp } = require('../app');

let app;

beforeAll(async () => {
  app = await createApp();
});

describe('GraphQL API', () => {
  it('should respond to getPlayers query', async () => {
    const res = await request(app)
      .post('/graphql')
      .send({
        query: '{ getPlayers { id name score lastUpdated } }'
      });
    // expect status
    expect(res.status).toBe(200);
    // expect data or errors
    expect(res.body).toHaveProperty('data');
  });
});
