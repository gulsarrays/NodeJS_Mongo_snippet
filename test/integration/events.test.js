/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
let appServer;

const addEvent = {
  type: 'eventType1',
  actor: {
    login: 'actorLogin1',
    avatar_url: 'actorAvatarUrl1'
  },
  repo: {
    name: 'repoName1',
    url: 'repoUrl1'
  },
  created_at: '2015-10-03 06:13:31'
};
const exec = async eventData => {
  return await request(appServer)
    .post('/events')
    .send(eventData);
};

describe('/events', () => {
  beforeEach(() => {
    appServer = require('../../app');
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe('GET /', () => {
    it('/ :: should return 204 if no data found', async () => {
      const res = await request(appServer).get('/events');
      expect(res.status).toBe(204);
    });

    it('/ :: should return list of events', async () => {
      const result = await exec(addEvent);

      const res = await request(appServer).get('/events');
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('type', 'eventType1');
    });

    it('/:id :: should return 404 for invalid id', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(appServer).get('/events/' + id);
      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 for valid id', async () => {
      const result = await exec(addEvent);

      const res = await request(appServer).get('/events/' + result.body._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('type', 'eventType1');
    });
  });

  describe('POST /', () => {
    it('/ :: should return 400 if invalid input', async () => {
      const addEvent = {
        //type: 'eventType1',
        actor: {
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const res = await exec(addEvent);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/ :: should return 400 if event type is less than 5 char', async () => {
      const event = {
        id: 4055191679,
        type: 'even',
        repo: {
          id: 352806,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };

      const res = await exec(event);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/ :: should return 400 if event type is greater than 55 char', async () => {
      const longString = new Array(57).join('a');
      const event = {
        id: 4055191679,
        type: longString,
        repo: {
          id: 352806,
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };

      const res = await exec(event);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/ :: should return 201 if valid input', async () => {
      const res = await exec(addEvent);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('type', 'eventType1');
    });

    it('/ :: should return 400 if duplicate event type', async () => {
      const result = await exec(addEvent);
      const res = await exec(addEvent);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('PUT /:id', () => {
    it('should return 404 for invalid id', async () => {
      const res = await request(appServer)
        .put('/events/' + 1)
        .send(addEvent);
      expect(res.status).toBe(404);
      expect(res.text).toMatch(/.*Invalid ID.*/);
    });

    it('should return 400 for invalid input', async () => {
      const id = mongoose.Types.ObjectId();

      const addEvent = {
        //type: 'eventType1',
        actor: {
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const res = await request(appServer)
        .put('/events/' + id)
        .send(addEvent);
      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*type.*/);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addEvent);
      const eventEdit = {
        type: 'eventType1-edit',
        actor: {
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const res = await request(appServer)
        .put('/events/' + result.body._id)
        .send(eventEdit);
      expect(res.status).toBe(200);

      const res1 = await request(appServer).get('/events/' + result.body._id);
      expect(res1.status).toBe(200);
      expect(res1.body).toHaveProperty('type', 'eventType1-edit');
    });

    it('/:id :: should return 400 if duplicate actor login', async () => {
      const result1 = await exec(addEvent);

      const event2 = {
        type: 'eventType2',
        actor: {
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const result2 = await exec(event2);

      const actorEdit = {
        type: 'eventType1',
        actor: {
          login: 'actorLogin1',
          avatar_url: 'actorAvatarUrl1'
        },
        repo: {
          name: 'repoName1',
          url: 'repoUrl1'
        },
        created_at: '2015-10-03 06:13:31'
      };
      const res = await request(appServer)
        .put('/events/' + result2.body._id)
        .send(actorEdit);

      expect(res.status).toBe(400);
      expect(res.text).toMatch(/.*already exists.*/);
    });
  });

  describe('DELETE /actors/:id', () => {
    it('/:id :: should return 404 for invalid id', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(appServer).delete('/events/' + id);
      expect(res.status).toBe(404);
    });

    it('/:id :: should return 200 if valid input', async () => {
      const result = await exec(addEvent);
      const res1 = await request(appServer).delete(
        '/events/' + result.body._id
      );
      expect(res1.status).toBe(200);
      const res2 = await request(appServer).get('/events/' + result.body._id);
      expect(res2.status).toBe(404);
    });
  });
});
