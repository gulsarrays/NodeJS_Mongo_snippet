const { Actor, validate } = require('../models/actors');

const actorController = {};

/* CRUD operation */
actorController.list = async (req, res) => {
  const result = await Actor.list(req);
  if (result.length === 0) return res.status(204).send('No data available');

  return res.send(result);
};

actorController.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Actor.isDuplicate(req.body.login, 0);

  if (isDuplicate.length > 0)
    return res
      .status(400)
      .send('Invalid Data - Actor with given login is already exists');

  const result = await Actor.create(req);
  return res.status(201).send(result);
};

actorController.details = async (req, res) => {
  const result = await Actor.details(req);

  if (!result) return res.status(404).send('Page not found');

  return res.send(result);
};

actorController.update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Actor.isDuplicate(req.body.login, req.params.id);
  if (isDuplicate.length > 0)
    return res
      .status(400)
      .send('Invalid Data - Actor with given name is already exists');

  const result = await Actor.update(req);
  return res.send(result);
};

actorController.delete = async (req, res) => {
  const result = await Actor.delete(req);

  if (!result) return res.status(404).send('Page not found');

  return res.send(result);
};

module.exports = actorController;
