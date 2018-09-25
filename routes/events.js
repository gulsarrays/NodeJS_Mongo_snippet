const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const eventController = require('../controllers/eventController');

const router = express.Router();

/* CRUD routes */
router.get('/', eventController.list);
router.post('/', eventController.create);
router.get('/:id', validateObjectId, eventController.details);
router.put('/:id', validateObjectId, eventController.update);
router.delete('/:id', validateObjectId, eventController.delete);

module.exports = router;
