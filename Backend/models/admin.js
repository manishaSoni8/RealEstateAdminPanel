const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Phone: {
        type: String,
        required: true,
    },
    user_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userType',
        required: false,
        default: null
    },
    resetToken: String,
    resetTokenExpiration: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
