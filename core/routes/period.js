const express = require('express');
const router = express.Router();
const periodController = require('../controllers/periodController');

/**
 * Manage Routes for '/period' target.
 */
router
    // HTTP Method: GET - CRUD Action: RETRIEVE
    .get('/:tag', periodController.retrievOnePeriod)
    .get('/', periodController.retrieveAllPeriods);

module.exports = router;