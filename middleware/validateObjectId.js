const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if (req.body.id !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(req.body.id))
      return res.status(404).send('Invalid ID.');
  } else {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send('Invalid ID.');
  }
  // if (!mongoose.Types.ObjectId.isValid(req.params.id))
  //   return res.status(404).send('Invalid ID.');

  next();
};
