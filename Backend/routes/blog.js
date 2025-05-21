const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.post('/blogs/comment', upload.single('Img'), blogController.addComment);

// Protected routes - only for admins
router.post(
    '/blogs/create', 
    blogController.verifyAdmin, 
    upload.single('Img'), 
    blogController.createBlog
);

router.delete(
    '/blogs/:id', 
    blogController.verifyAdmin, 
    blogController.deleteBlog
);

// Add this new route before module.exports
router.put(
    '/blogs/:id',
    blogController.verifyAdmin,
    upload.single('Img'),
    blogController.editBlog
);

module.exports = router;
