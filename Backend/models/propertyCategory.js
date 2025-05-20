const mongoose = require('mongoose');

const propertyCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, {
    collection: 'propertycategories' // Add this to match your MongoDB collection name
});

module.exports = mongoose.model('PropertyCategory', propertyCategorySchema);