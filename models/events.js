const Joi = require('joi');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // id: {
  //   type: Number,
  //   min: 0,
  //   max: 9999999999999,
  //   required: true
  // },
  type: {
    type: String,
    minlength: 5,
    maxlength: 55,
    required: true
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Actor',
    required: true
  },
  repo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repo',
    required: true
  },
  created_at: {
    type: Date
  }
});

const Event = mongoose.model('Event', eventSchema);
const eventModel = {};

eventModel.list = async () => {
  const events = await Event.find()
    .select('type actor repo created_at')
    .populate('actor', '-_id -__v')
    .populate('repo', '-_id -__v')
    .sort('type');
  return events;
};

eventModel.create = async req => {
  let event;
  const { ObjectId } = mongoose.Types.ObjectId;
  event = new Event({
    type: req.body.type,
    actor: new ObjectId(req.body.actor),
    repo: new ObjectId(req.body.repo),
    created_at:
      req.body.created_at !== undefined ? req.body.created_at : Date.now
  });
  event = await event.save();
  return event;
};

eventModel.details = async req => {
  const event = Event.findById(req.params.id)
    .select('type actor repo created_at')
    .populate('actor', '-_id -__v')
    .populate('repo', '-_id -__v');
  return event;
};

eventModel.update = async req => {
  const event = await Event.findOneAndUpdate(
    req.params.id,
    {
      type: req.body.type,
      actor: req.body.actor,
      repo: req.body.repo,
      created_at:
        req.body.created_at !== undefined ? req.body.created_at : Date.now
    },
    { new: true }
  );
  return event;
};

eventModel.delete = async req => {
  const event = await Event.findByIdAndRemove(req.params.id);
  return event;
};

eventModel.erase = async () => {
  const result = await Event.remove();
  return result;
};

eventModel.isDuplicate = async (type, actor, createdAt = null, id = 0) => {
  let event;
  const { ObjectId } = mongoose.Types.ObjectId;
  if (id === 0) {
    event = await Event.find({
      type,
      actor: new ObjectId(actor),
      created_at: createdAt
    });
  } else {
    event = await Event.find({
      type,
      actor: new ObjectId(actor),
      created_at: createdAt,
      _id: { $ne: new ObjectId(id) }
    });
  }
  return event;
};

eventModel.getQueryResult = async qry => {
  const result = await Event.find(qry);
  return result;
};

function validate(inputData) {
  const eventsSchema = {
    type: Joi.string()
      .min(5)
      .max(55)
      .required(),
    actor: Joi.object({
      login: Joi.string()
        .min(5)
        .max(55)
        .required(),
      avatar_url: Joi.string()
        .min(5)
        .max(55)
        .required()
    }).required(),
    repo: Joi.object({
      name: Joi.string()
        .min(5)
        .max(55)
        .required(),
      url: Joi.string()
        .min(5)
        .max(55)
        .required()
    }).required(),
    created_at: Joi.date().required()
  };
  return Joi.validate(inputData, eventsSchema);
}

module.exports.Event = eventModel;
module.exports.validate = validate;
