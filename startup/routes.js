const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('../routes/index');
const repoRouter = require('../routes/repos');
const actorRouter = require('../routes/actors');
const eventRouter = require('../routes/events');
const eraseRouter = require('../routes/erase');

module.exports = app => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/', indexRouter);
  app.use('/repos', repoRouter);
  app.use('/actors', actorRouter);
  app.use('/events', eventRouter);
  app.use('/erase', eraseRouter);
};
