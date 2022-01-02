const express = require('express');
const router = express.Router();
const asyncController = require('../controllers/asyncController');

/**
 * Manage Routes for '/async' – i.e. chronographic.
 */
router
    .get('/chronographic/:tag', asyncController.chronographic);

module.exports = router;