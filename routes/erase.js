const express = require('express');
const eraseController = require('../controllers/eraseController');

const router = express.Router();

router.delete('/', eraseController.erase);

module.exports = router;
