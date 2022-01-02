const express = require('express');
const router = express.Router();
const compositorController = require('../controllers/compositorController');

/**
 * Manage Routes for '/compositor' target.
 */
router
    // HTTP Method: GET - CRUD Action: RETRIEVE
    .get('/:tag', compositorController.retrieveOneCompositor)
    .get('/', compositorController.retrieveAllCompositors);

module.exports = router;