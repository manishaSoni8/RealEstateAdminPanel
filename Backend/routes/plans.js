const express = require('express');
const router = express.Router();
const plansController = require('../controllers/plans');
const isAuth = require('../middleware/is-auth');


router.get('/', plansController.getPlans);

router.get('/:id', plansController.getPlan);

router.post('/', plansController.createPlan);

router.put('/:id', plansController.updatePlan);

router.delete('/:id', plansController.deletePlan);

module.exports = router;