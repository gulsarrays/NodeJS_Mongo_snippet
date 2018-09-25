const config = require('config');

module.exports = () => {
  if (!config.get('dbName')) {
    throw new Error(
      'FATAL ERROR: Database connection parameters are not defined.'
    );
  }
};
