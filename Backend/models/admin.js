const mongoose = require('mongoose');


mongoose.connection.once('open', async () => {
    try {
        // Drop all indexes
        await mongoose.connection.db.collection('admin').dropIndexes();
    } catch (err) {
        console.log('No indexes to drop');
    }
});

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
        default: null
    },
    resetToken: String,
    resetTokenExpiration: Date
}, {
    timestamps: true
});

// Create only the necessary indexes
adminSchema.index({ Email: 1 }, { unique: true });

module.exports = mongoose.model('Admin', adminSchema);
