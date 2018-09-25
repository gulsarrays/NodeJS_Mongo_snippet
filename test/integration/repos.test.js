/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');

let appServer;
const addRepo = { name: 'repoName1', url: 'repoUrl1' };
const exec = async repoData => {
  return await request(appServer)
    .post('/repos')
    .send(repoData);
};

describe('/repos', () => {
  beforeEach(() => {
    appServer = require('../../app');
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('GET / ', () => {
    it('/ :: should return 204 if no data found', async () => {
      const res = await request(appServer).get('/repos');
      expect(res.status).toBe(204);
    });

    it('/ :: should return list of repos', async () => {
      const result = await exec(addRepo);

      const res = await request(appServer).get('/repos');
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('name', 'repoName1');
    });

    it('/:id :: should return 404 for invalid id', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(appServer).get('/repos/' + id);
      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 for valid id', async () => {
      const result = await exec(addRepo);

      const res = await request(appServer).get('/repos/' + result.body._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'repoName1');
    });
  });

  describe('POST /repos', () => {
    it('/ :: should return 400 if invalid input', async () => {
      const repo = { url: 'repoUrl1' };

      const res = await exec(repo);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*name.*/);
    });

    it('/ :: should return 400 if repo name is less than 5 char', async () => {
      const repo = { name: 'repo', url: 'repoUrl1' };

      const res = await exec(repo);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*name.*/);
    });

    it('/ :: should return 400 if repo name is greater than 55 char', async () => {
      const longString = new Array(57).join('a');
      const repo = { name: longString, url: 'repoUrl1' };

      const res = await exec(repo);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*name.*/);
    });

    it('/ :: should return 201 if valid input', async () => {
      const res = await exec(addRepo);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'repoName1');
    });

    it('/ :: should return 400 if duplicate repo name', async () => {
      const result = await exec(addRepo);
      const res = await exec(addRepo);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('PUT /:id', () => {
    it('should return 404 for invalid id', async () => {
      const repo = { name: 'repoName1', url: 'repoUrl1' };
      const res = await request(appServer)
        .put('/repos/' + 1)
        .send(repo);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/.*Invalid ID.*/);
    });

    it('should return 400 for invalid input', async () => {
      const id = mongoose.Types.ObjectId();

      const repo = { url: 'repoUrl1' };
      const res = await request(appServer)
        .put('/repos/' + id)
        .send(repo);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*name.*/);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addRepo);
      const repoEdit = { name: 'repoName1-edit', url: 'repoUrl1-edit' };
      const res = await request(appServer)
        .put('/repos/' + result.body._id)
        .send(repoEdit);
      expect(res.status).toBe(200);

      const res1 = await request(appServer).get('/repos/' + result.body._id);
      expect(res1.status).toBe(200);
      expect(res1.body).toHaveProperty('name', 'repoName1-edit');
    });

    it('/:id :: should return 400 if duplicate repo name', async () => {
      const result1 = await exec(addRepo);

      const repo2 = { name: 'repoName2', url: 'repoUrl2' };
      const result2 = await exec(repo2);

      const repoEdit = { name: 'repoName1', url: 'repoUrl2-edit' };
      const res = await request(appServer)
        .put('/repos/' + result2.body._id)
        .send(repoEdit);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('DELETE /repos/:id', () => {
    it('/:id :: should return 404 for invalid id', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(appServer).delete('/repos/' + id);

      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addRepo);
      const res1 = await request(appServer).delete('/repos/' + result.body._id);
      expect(res1.status).toBe(200);

      const res2 = await request(appServer).get('/repos/' + result.body._id);
      expect(res2.status).toBe(404);
    });
  });
});
