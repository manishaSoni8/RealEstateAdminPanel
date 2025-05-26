const Plan = require('../models/plans');

// Get all plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single plan
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new plan
exports.createPlan = async (req, res) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update plan
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};