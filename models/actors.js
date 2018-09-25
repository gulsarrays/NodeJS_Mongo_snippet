const Joi = require('joi');
const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   min: 0,
  //   max: 999999999999,
  //   required: true
  // },
  login: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  avatar_url: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true
  }
});

const Actor = mongoose.model('Actor', actorSchema);
const actorModel = {};

actorModel.list = async () => {
  const actors = await Actor.find().sort('login');
  return actors;
};

actorModel.create = async req => {
  let actor = new Actor({
    login: req.body.login,
    avatar_url: req.body.avatar_url
  });
  actor = await actor.save();
  return actor;
};

actorModel.details = async req => {
  const actor = await Actor.findById(req.params.id);
  return actor;
};

actorModel.update = async req => {
  const actor = await Actor.findOneAndUpdate(
    req.body.id,
    { login: req.body.login, avatar_url: req.body.avatar_url },
    { new: true }
  );
  return actor;
};

actorModel.delete = async req => {
  const actor = await Actor.findByIdAndRemove(req.params.id);
  return actor;
};

actorModel.erase = async () => {
  const result = await Actor.remove();
  return result;
};

actorModel.isDuplicate = async (login, id = 0) => {
  let actor;
  if (id === 0) {
    actor = await Actor.find({ login });
  } else {
    const { ObjectId } = mongoose.Types.ObjectId;
    actor = await Actor.find({ login, _id: { $ne: new ObjectId(id) } });
  }
  return actor;
};

actorModel.getQueryResult = async qry => {
  const result = await Actor.find(qry);
  return result;
};

function validate(inputData) {
  const actorsSchema = {
    login: Joi.string()
      .min(5)
      .max(55)
      .required(),
    avatar_url: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(inputData, actorsSchema);
}

module.exports.validate = validate;
module.exports.Actor = actorModel;
