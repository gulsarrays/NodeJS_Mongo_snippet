const { Event, validate } = require('../models/events');
const { Repo } = require('../models/repos');
const { Actor } = require('../models/actors');

const eventController = {};
/* CRUD operation */
eventController.list = async (req, res) => {
  const result = await Event.list();

  if (result.length === 0) return res.status(204).send('No data available');

  return res.send(result);
};

const addRepo = async req => {
  let repoId;
  const qry = { name: req.body.repo.name };
  const isRepoExists = await Repo.getQueryResult(qry);

  const repoData = {
    body: {
      // id: req.body.repo.id,
      name: req.body.repo.name,
      url: req.body.repo.url
    }
  };
  let repoResult;
  if (isRepoExists.length === 0) {
    repoResult = await Repo.create(repoData);
    /*eslint-disable */
    repoId = repoResult._id;
    /* eslint-enable */
  } else {
    /*eslint-disable */
    repoId = isRepoExists[0]._id;
    /* eslint-enable */
  }

  return repoId;
};
const addActor = async req => {
  let actorId;
  const qry = { login: req.body.actor.login };
  const isActorExists = await Actor.getQueryResult(qry);

  const actorData = {
    body: {
      login: req.body.actor.login,
      avatar_url: req.body.actor.avatar_url
    }
  };
  let actorResult;
  if (isActorExists.length === 0) {
    actorResult = await Actor.create(actorData);
    /*eslint-disable */
    actorId = actorResult._id;
    /* eslint-enable */
  } else {
    /*eslint-disable */
    actorId = isActorExists[0]._id;
    /* eslint-enable */
  }

  return actorId;
};

eventController.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const repoId = await addRepo(req);
  const actorId = await addActor(req);

  const eventData = {
    body: {
      type: req.body.type,
      repo: repoId,
      actor: actorId,
      created_at:
        req.body.created_at !== undefined ? req.body.created_at : Date.now
    }
  };

  const isDuplicate = await Event.isDuplicate(
    req.body.type,
    actorId,
    req.body.created_at
  );
  if (isDuplicate.length > 0)
    res
      .status(400)
      .send('Invalid Data - Event with given type is already exists');

  const result = await Event.create(eventData);
  return res.status(201).send(result);
};

eventController.details = async (req, res) => {
  const result = await Event.details(req);

  if (!result) return res.status(404).send('Page not found');

  return res.send(result);
};

eventController.update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const repoId = await addRepo(req);
  const actorId = await addActor(req);

  const createdAt =
    req.body.created_at !== undefined ? req.body.created_at : null;
  const isDuplicate = await Event.isDuplicate(
    req.body.type,
    actorId,
    createdAt
  );
  if (isDuplicate.length > 0)
    return res
      .status(400)
      .send('Invalid Data - Event with given name is already exists');

  const eventData = {
    params: req.params.id,
    body: {
      type: req.body.type,
      repo: repoId,
      actor: actorId,
      created_at:
        req.body.created_at !== undefined ? req.body.created_at : Date.now
    }
  };

  const result = await Event.update(eventData);
  return res.send(result);
};

eventController.delete = async (req, res) => {
  const result = await Event.delete(req);

  if (!result) return res.status(404).send('Page not found');

  return res.send(result);
};

module.exports = eventController;
