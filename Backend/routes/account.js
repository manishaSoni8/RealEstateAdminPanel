const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');


router.post('/create-purchase', accountController.createPurchase);
 router.post('/createpayment', accountController.createPayment);
 
// Route to get all transactions
router.get('/transactions', accountController.getAllTransactions);
 
module.exports = router;
 