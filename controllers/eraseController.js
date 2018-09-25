const { Repo } = require('../models/repos');
const { Actor } = require('../models/actors');
const { Event } = require('../models/events');

const eraseController = {};
eraseController.erase = async (req, res) => {
  const p1 = await Repo.erase();
  const p2 = await Actor.erase();
  const p3 = await Event.erase();

  Promise.all([p1, p2, p3])
    .then(() => res.send('Successfully earse all the events'))
    .catch(err =>
      res.status(500).send('Internal server error while erasing all the data')
    );
};

module.exports = eraseController;
