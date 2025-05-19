const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const adminController = require('../controllers/adminController');

const adminValidationRules = [
    body('First_Name').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('Last_Name').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('Email').isEmail().withMessage('Invalid email format'),
    body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('Phone').optional().matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    body('Website').optional().isURL().withMessage('Invalid website URL'),
    body('Facebook').optional().isURL().withMessage('Invalid Facebook URL'),
    body('Twitter').optional().isURL().withMessage('Invalid Twitter URL')
];

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.post('/create', adminValidationRules, adminController.createAdmin);
router.put('/:id', adminValidationRules, adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin); 

module.exports = router;