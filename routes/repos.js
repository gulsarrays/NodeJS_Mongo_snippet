const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const repoController = require('../controllers/repoController');

const router = express.Router();

/* CRUD routes */
router.get('/', repoController.list);
router.post('/', repoController.create);
router.get('/:id', validateObjectId, repoController.details);
router.put('/:id', validateObjectId, repoController.update);
router.delete('/:id', validateObjectId, repoController.delete);

module.exports = router;
