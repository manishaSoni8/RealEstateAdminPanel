const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');

// Transaction routes
router.get('/transactions', accountController.getAllTransactions);
router.get('/transactions/:id', accountController.getTransactionById);
router.post('/transactions/create', accountController.createTransaction);

module.exports = router;
 