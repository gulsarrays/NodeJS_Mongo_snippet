const mongoose = require('mongoose');
const config = require('config');
// const winston = require('winston');

module.exports = () => {
  const dbName = config.get('dbName');
  mongoose
    .connect(
      dbName,
      { useNewUrlParser: true }
    )
    .then(() => console.log(`Successfully connected to ${dbName}...`));
};
