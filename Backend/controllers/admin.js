const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
 
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: { api_key: process.env.SENDGRID_API_KEY }
}));
 
// Admin Login
exports.postAdminLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }
 
    const admin = await Admin.findOne({ Email });
    if (!admin) {
      return res.status(401).json({ message: 'No user found with this email' });
    }
 
    const isMatch = await bcrypt.compare(Password, admin.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
 
    const token = jwt.sign(
      { adminId: admin._id, email: admin.Email },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '24h' }
    );
 
    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.Email,
        name: admin.Name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
// Admin Logout
exports.postAdminLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logout successful' });
  });
};
 
// Admin Reset Password Request
exports.postAdminReset = async (req, res) => {
  try {
    const { Email } = req.body;
    if (!Email) {
      return res.status(400).json({ message: 'Please provide an email address.' });
    }
 
    const buffer = await new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });
 
    const token = buffer.toString('hex');
    const admin = await Admin.findOne({ Email: req.body.Email });
 
    if (!admin) {
      return res.status(404).json({ message: 'No account with that email found.' });
    }
 
    admin.resetToken = token;
    admin.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await admin.save();
 
    await transporter.sendMail({
                to: req.body.Email,
                from: 'balajipathak@startbitsolutions.com',
                subject: 'Password Reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="${process.env.BASE_URL || 'http://localhost:3005'}/reset/${token}">link</a> to set a new password.</p>
                `
            });
 
    res.status(200).json({ message: 'Reset link sent to your email.' });
 
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
};
 
// Admin Validate Token for New Password
exports.getAdminNewPassword = async (req, res) => {
  try {
    const token = req.params.token;
 
    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });
 
    if (!admin) {
      return res.status(400).json({ message: 'Token invalid or expired' });
    }
 
    res.status(200).json({
      message: 'Token valid',
      adminId: admin._id.toString(),
      resetToken: token
    });
  } catch (err) {
    console.error('Get new password error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
// Admin Set New Password
exports.postAdminNewPassword = async (req, res) => {
  try {
    const { Password, adminId, resetToken } = req.body;
 
    const admin = await Admin.findOne({
      _id: adminId,
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() }
    });
 
    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
 
    const hashedPassword = await bcrypt.hash(Password, 10);
    admin.Password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiration = undefined;
    await admin.save();
 
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Post new password error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 