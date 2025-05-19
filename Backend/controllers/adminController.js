const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Configure nodemailer with SendGrid transport
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}));

// Email template for admin credentials
const getEmailTemplate = (adminName, email, password) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Real Estate Admin Panel</h2>
            <p>Dear ${adminName},</p>
            <p>Your admin account has been created successfully. Here are your login credentials:</p>
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://http://localhost:5173/admin-login" 
                   style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                          text-decoration: none; border-radius: 5px;">
                    Login to Admin Panel
                </a>
            </div>
            <p>Best regards,<br>Real Estate Admin Team</p>
        </div>
    `;
};

const ADMIN_USER_TYPE_ID = "68231b72715cec39389a589c";

const adminController = {
    // Get all admins
    getAllAdmins: async (req, res) => {
        try {
            const admins = await Admin.find().select('-Password');
            res.json(admins);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single admin
    getAdminById: async (req, res) => {
        try {
            const admin = await Admin.findById(req.params.id).select('-Password');
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.json(admin);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create admin
    createAdmin: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { Email, Password, Phone, ...otherData } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ Email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // Validate phone number
            if (!Phone || !/^\d{10}$/.test(Phone)) {
                return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(Password, 10);

            const admin = new Admin({
                ...otherData,
                Email,
                Phone,
                Password: hashedPassword,
                user_type_id: ADMIN_USER_TYPE_ID
            });

            const savedAdmin = await admin.save();

            // Send welcome email with credentials using nodemailer
            try {
                await transporter.sendMail({
                    to: Email,
                    from: 'balajipathak@startbitsolutions.com',
                    subject: 'Welcome to Real Estate Admin Panel - Your Login Credentials',
                    html: getEmailTemplate(
                        `${otherData.First_Name} ${otherData.Last_Name}`,
                        Email,
                        Password
                    )
                });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Continue with the response even if email fails
            }

            const { Password: _, ...adminData } = savedAdmin.toObject();
            res.status(201).json({
                ...adminData,
                message: 'Admin created successfully. Login credentials have been sent to your email.'
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update admin
    updateAdmin: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { Password, Phone, ...updateData } = req.body;
            let update = updateData;

            // Validate phone number if it's being updated
            if (Phone && !/^\d{10}$/.test(Phone)) {
                return res.status(400).json({ message: 'Invalid phone number. Must be 10 digits.' });
            }

            if (Phone) {
                update.Phone = Phone;
            }

            if (Password) {
                const hashedPassword = await bcrypt.hash(Password, 10);
                update.Password = hashedPassword;
            }

            const admin = await Admin.findByIdAndUpdate(
                req.params.id,
                    update,
                { new: true, runValidators: true }
            ).select('-Password');

            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }

            res.json(admin);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete admin
    deleteAdmin: async (req, res) => {
        try {
            const admin = await Admin.findByIdAndDelete(req.params.id);
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            res.json({ message: 'Admin deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = adminController;