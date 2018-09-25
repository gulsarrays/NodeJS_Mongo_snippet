const { Repo, validate } = require('../models/repos');

const repoController = {};

/* CRUD operation */
repoController.list = async (req, res) => {
  const result = await Repo.list();

  if (result.length === 0) return res.status(204).send('No data available');

  return res.send(result);
};

repoController.create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Repo.isDuplicate(req.body.name, 0);
  if (isDuplicate.length > 0)
    return res
      .status(400)
      .send('Invalid Data - Repo with given name is already exists');

  const result = await Repo.create(req);
  return res.status(201).send(result);
};

repoController.details = async (req, res) => {
  const result = await Repo.details(req);

  if (!result) return res.status(404).send('Page not found');

  return res.send(result);
};

repoController.update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDuplicate = await Repo.isDuplicate(req.body.name, req.params.id);
  if (isDuplicate.length > 0)
    return res
      .status(400)
      .send('Invalid Data - Repo with given name is already exists');

  const result = await Repo.update(req);
  return res.send(result);
};

repoController.delete = async (req, res) => {
  const result = await Repo.delete(req);

  if (!result) return res.status(404).send('Page not found');

  return res.send(result);
};

module.exports = repoController;
