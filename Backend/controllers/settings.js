const Company_Info = require('../models/companyInfo');
 
// Get company info (assuming single record)
exports.getCompanyInfo = async (req, res) => {
  try {
    const company = await Company_Info.findOne();
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
 
// Update company info with optional logo
exports.updateCompanyInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
 
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }
 
    const updated = await Company_Info.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};