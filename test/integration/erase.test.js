/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');

let appServer;

describe('/erase', () => {
  beforeEach(() => {
    appServer = require('../../app.js');
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('/ :: should return 200 for success', async () => {
    const res = await request(appServer).delete('/erase');
    expect(res.status).toBe(200);

    const res1 = await request(appServer).get('/repos');
    expect(res1.status).toBe(204);

    const res2 = await request(appServer).get('/actors');
    expect(res2.status).toBe(204);

    const res3 = await request(appServer).get('/events');
    expect(res3.status).toBe(204);
  });
});
