const Joi = require('joi');
const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   min: 0,
  //   maxlength: 999999999999,
  //   required: true
  // } ,
  name: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true
  },
  url: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true
  }
});

const Repo = mongoose.model('Repo', repoSchema);
const repoModel = {};

/* CRUD operation */
repoModel.list = async () => {
  const repos = await Repo.find().sort('name');
  return repos;
};

repoModel.create = async req => {
  let repo = new Repo({ name: req.body.name, url: req.body.url });
  repo = await repo.save();
  return repo;
};

repoModel.details = async req => {
  const repo = await Repo.findById(req.params.id);
  return repo;
};

repoModel.update = req => {
  const repo = Repo.findOneAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      url: req.body.url
    },
    { new: true }
  );

  return repo;
};

repoModel.delete = async req => {
  const repo = await Repo.findByIdAndRemove(req.params.id);

  return repo;
};

repoModel.erase = async () => {
  const result = await Repo.remove();
  return result;
};

repoModel.isDuplicate = async (name, id = 0) => {
  let repo;
  if (id === 0) {
    repo = await Repo.find({ name });
  } else {
    const { ObjectId } = mongoose.Types.ObjectId;
    repo = await Repo.find({ name, _id: { $ne: new ObjectId(id) } });
  }

  return repo;
};

repoModel.getQueryResult = async qry => {
  const result = await Repo.find(qry);
  return result;
};

function validate(inputData) {
  const reposSchema = {
    name: Joi.string()
      .min(5)
      .max(55)
      .required(),
    url: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(inputData, reposSchema);
}

module.exports.validate = validate;
module.exports.Repo = repoModel;
