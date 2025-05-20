const mongoose = require('mongoose');

// Check if the model exists before defining it
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
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
    Facebook: {
        type: String,
        default: null
    },
    Twitter: {
        type: String,
        default: null
    },
    Website: {
        type: String,
        default: null
    },
    Public_email: {
        type: String,
        default: null
    },
    Phone: {
        type: String,
        default: null
    },
    FAX: {
        type: String,
        default: null
    },
    user_image: {
        type: String,
        default: null
    },
    user_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userType',
        required: false,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    auth_provider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetTokenExpiration: Date
}, {
    timestamps: true
}));

// Create index if it doesn't exist
if (!User.schema.indexes().find(index => index[0].Email === 1)) {
    User.schema.index({ Email: 1 }, { unique: true });
}

module.exports = User;
