const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const actorController = require('../controllers/actorController');

const router = express.Router();

/* CRUD routes */
router.get('/', actorController.list);
router.post('/', actorController.create);
router.get('/:id', validateObjectId, actorController.details);
router.put('/:id', validateObjectId, actorController.update);
router.delete('/:id', validateObjectId, actorController.delete);

module.exports = router;
