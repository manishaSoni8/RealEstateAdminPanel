const PropertyData = require('../models/propertyData');
const PropertyImages = require('../models/propertyImage');
const PropertyVideos = require('../models/propertyVideo');
const User = require('../models/user');
const { PropertyDataFeature } = require('../models/propertyFeature');
const PropertyCategory = require('../models/propertyCategory');
const PropertyState = require('../models/state');
const PropertyCity = require('../models/city');
const PropertyStatus = require('../models/statusCategory');

// Add this new method to your existing propertyController
const propertyController = {
    // Get all available properties with their related data
    getAvailableProperties: async (req, res) => {
        try {
            const properties = await PropertyData.find({ saleStatus: 'available' })
                .populate('categoryId')
                .populate('stateId')
                .populate('cityId')
                .populate('statusId')
                .populate('userId');

            // Get additional data for each property
            const enhancedProperties = await Promise.all(properties.map(async (property) => {
                const propertyImages = await PropertyImages.find({ propertyId: property._id });
                const propertyVideos = await PropertyVideos.find({ propertyId: property._id });
                const propertyFeatures = await PropertyDataFeature.find({ propertyId: property._id })
                    .populate('featureId');

                return {
                    ...property.toObject(),
                    additionalImages: propertyImages,
                    videos: propertyVideos,
                    features: propertyFeatures
                };
            }));

            res.json(enhancedProperties);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all sold properties with their related data
    getSoldProperties: async (req, res) => {
        try {
            const properties = await PropertyData.find({ saleStatus: 'sold' })
                .populate('categoryId')
                .populate('stateId')
                .populate('cityId')
                .populate('statusId')
                .populate('userId');

            // Get additional data for each property
            const enhancedProperties = await Promise.all(properties.map(async (property) => {
                const propertyImages = await PropertyImages.find({ propertyId: property._id });
                const propertyVideos = await PropertyVideos.find({ propertyId: property._id });
                const propertyFeatures = await PropertyDataFeature.find({ propertyId: property._id })
                    .populate('featureId');

                return {
                    ...property.toObject(),
                    additionalImages: propertyImages,
                    videos: propertyVideos,
                    features: propertyFeatures
                };
            }));

            res.json(enhancedProperties);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single property with all details
    getPropertyById: async (req, res) => {
        try {
            const property = await PropertyData.findById(req.params.id)
                .populate('categoryId')
                .populate('stateId')
                .populate('cityId')
                .populate('statusId')
                .populate('userId');

            if (!property) {
                return res.status(404).json({ message: 'Property not found' });
            }

            const propertyImages = await PropertyImages.find({ propertyId: property._id });
            const propertyVideos = await PropertyVideos.find({ propertyId: property._id });
            const propertyFeatures = await PropertyDataFeature.find({ propertyId: property._id })
                .populate('featureId');

            const enhancedProperty = {
                ...property.toObject(),
                additionalImages: propertyImages,
                videos: propertyVideos,
                features: propertyFeatures
            };

            res.json(enhancedProperty);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add these methods for handling uploads   
    uploadPropertyImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image file provided' });
            }
            res.json({ 
                success: true,
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    uploadPropertyImages: async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No images provided' });
            }
            const uploadedFiles = req.files.map(file => ({
                filename: file.filename,
                path: `/uploads/${file.filename}`
            }));
            res.json({ 
                success: true,
                files: uploadedFiles
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = propertyController;
