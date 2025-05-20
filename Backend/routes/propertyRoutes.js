const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the uploads directory exists
        const uploadDir = path.join(__dirname, '..', 'uploads');
        require('fs').mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Routes
router.get('/available', propertyController.getAvailableProperties);
router.get('/sold', propertyController.getSoldProperties);
router.get('/detail/:id', propertyController.getPropertyById);
router.post('/upload/image', upload.single('image'), propertyController.uploadPropertyImage);
router.post('/upload/images', upload.array('images', 10), propertyController.uploadPropertyImages);

module.exports = router;