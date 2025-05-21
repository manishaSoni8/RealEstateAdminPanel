const express = require('express');
const router = express.Router();
const companyInfoController = require('../controllers/settings');
const multer = require('multer');
const path = require('path');
 
// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  }
});
 
const upload = multer({ storage });
 
// Routes
 
// Get company info
router.get('/companyInfo', companyInfoController.getCompanyInfo);
 
// Update company info (with optional logo upload)
router.put('/companyInfo/:id', upload.single('logo'), companyInfoController.updateCompanyInfo);
 
module.exports = router;