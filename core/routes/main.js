const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

/**
 * Manage Routes for basic target.
 */
router
    .get('/info', mainController.info)
    .get('/', mainController.home)

module.exports = router;