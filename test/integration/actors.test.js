/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');

let appServer;
const addActor = { login: 'actorLogin1', avatar_url: 'avatarUrl1' };
const exec = async addActor => {
  return await request(appServer)
    .post('/actors')
    .send(addActor);
};

describe('/actors', () => {
  beforeEach(() => {
    appServer = require('../../app.js');
  });
  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });
  describe('GET / ', () => {
    it('/ :: should return 204 if no data found', async () => {
      const res = await request(appServer).get('/actors');
      expect(res.status).toBe(204);
    });

    it('/ :: should return list of actors', async () => {
      const result = await exec(addActor);

      const res = await request(appServer).get('/actors');
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('login', 'actorLogin1');
    });

    it('/:id :: should return 404 for invalid id', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(appServer).get('/actors/' + id);
      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 for valid id', async () => {
      const result = await exec(addActor);

      const res = await request(appServer).get('/actors/' + result.body._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('login', 'actorLogin1');
    });
  });

  describe('POST /actors', () => {
    it('/ :: should return 400 if invalid input', async () => {
      const actor = { avatar_url: 'avatarUrl1' };
      const res = await exec(actor);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 400 if actor login is less than 5 char', async () => {
      const actor = { login: 'acto', avatar_url: 'actorAvatarUrl1' };

      const res = await exec(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 400 if actor login is greater than 55 char', async () => {
      const longString = new Array(57).join('a');
      const actor = { name: longString, avatar_url: 'actorAvatarUrl1' };

      const res = await exec(actor);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/ :: should return 201 if valid input', async () => {
      const res = await exec(addActor);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('login', 'actorLogin1');
    });

    it('/ :: should return 400 if duplicate actor login', async () => {
      const result = await exec(addActor);
      const res = await exec(addActor);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('PUT /:id', () => {
    it('should return 404 for invalid id', async () => {
      const actor = { login: 'actorLogin1', avatar_url: 'avatarUrl1' };
      const res = await request(appServer)
        .put('/actors/' + 1)
        .send(actor);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/.*Invalid ID.*/);
    });

    it('should return 400 for invalid input', async () => {
      const id = mongoose.Types.ObjectId();

      const actor = { avatar_url: 'avatarUrl1' };
      const res = await request(appServer)
        .put('/actors/' + id)
        .send(actor);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*login.*/);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addActor);
      const actorEdit = {
        login: 'actorLogin1-edit',
        avatar_url: 'avatarUrl1-edit'
      };
      const res = await request(appServer)
        .put('/actors/' + result.body._id)
        .send(actorEdit);
      expect(res.status).toBe(200);

      const res1 = await request(appServer).get('/actors/' + result.body._id);
      expect(res1.status).toBe(200);
      expect(res1.body).toHaveProperty('login', 'actorLogin1-edit');
    });

    it('/:id :: should return 400 if duplicate actor login', async () => {
      const result1 = await exec(addActor);

      const actor2 = { login: 'actorLogin2', avatar_url: 'avatarUrl2' };
      const result2 = await exec(actor2);

      const actorEdit = { login: 'actorLogin1', avatar_url: 'avatarUrl2-edit' };
      const res = await request(appServer)
        .put('/actors/' + result2.body._id)
        .send(actorEdit);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('DELETE /actors/:id', () => {
    it('/:id :: should return 404 for invalid id', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(appServer).delete('/actors/' + id);
      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addActor);
      const res1 = await request(appServer).delete(
        '/actors/' + result.body._id
      );
      expect(res1.status).toBe(200);
      const res2 = await request(appServer).get('/actors/' + result.body._id);
      expect(res2.status).toBe(404);
    });
  });
});
