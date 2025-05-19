const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const { check, body } = require('express-validator');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const Config = require('../config/auth.config');

router.post('/admin-login', [
    check('Email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    check('Password')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
], adminController.postAdminLogin);

router.post('/admin-logout', adminController.postAdminLogout);

router.post('/admin-reset', adminController.postAdminReset);
router.get('/admin-reset/:token', adminController.getAdminNewPassword);
router.post('/admin-new-password', adminController.postAdminNewPassword);


module.exports = router;
