const express = require('express');
const router = express.Router();
const localUserController = require('../controllers/localUserController');

router.get('/customers', localUserController.getAllLocalUsers);
router.get('/customers/:id', localUserController.getLocalUserById);

module.exports = router;