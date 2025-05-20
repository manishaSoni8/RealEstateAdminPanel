const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
router.get('/stats/total', dashboardController.getTotalProperties);
router.get('/stats/by-state', dashboardController.getPropertiesByState);
router.get('/stats/top-sold', dashboardController.getTopSoldProperties);
router.get('/stats/total-sales', dashboardController.getTotalSales);

module.exports = router;