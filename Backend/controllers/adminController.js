const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

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
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { Email, Password, ...otherData } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ Email });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(Password, 10);

            const admin = new Admin({
                ...otherData,
                Email,
                Password: hashedPassword,
                user_type_id: ADMIN_USER_TYPE_ID
            });

            const savedAdmin = await admin.save();
            const { Password: _, ...adminData } = savedAdmin.toObject();
            res.status(201).json(adminData);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update admin
    updateAdmin: async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { Password, ...updateData } = req.body;
            let update = updateData;

            if (Password) {
                const hashedPassword = await bcrypt.hash(Password, 10);
                update.Password = hashedPassword;
            }

            const admin = await Admin.findByIdAndUpdate(
                req.params.id,
                update,
                { new: true }
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