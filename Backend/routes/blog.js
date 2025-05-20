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

router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById); // ✅ FIXED name
router.post('/blogs/comment', upload.single('Img'), blogController.addComment);

module.exports = router;
