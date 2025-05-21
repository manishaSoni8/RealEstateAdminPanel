const AgentMessage = require('../models/agentMessage');
const User = require('../models/user');
const ContactForm = require('../models/contactForm');
 
// Get all agent messages with pagination and search
exports.getAllAgentMessages = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const query = {
      content: { $regex: search, $options: 'i' },
    };
 
    const total = await AgentMessage.countDocuments(query);
    const messages = await AgentMessage.find(query)
      .populate('agentId', 'First_Name Last_Name')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
 
    res.status(200).json({ data: messages, total });
  } catch (err) {
    console.error('Error fetching agent messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};
 
// Get single message by ID
exports.getAgentMessageById = async (req, res) => {
  try {
    const message = await AgentMessage.findById(req.params.id).populate('agentId', 'First_Name Last_Name');
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// Delete message
exports.deleteAgentMessage = async (req, res) => {
  try {
    const message = await AgentMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
 
    await AgentMessage.findByIdAndDelete(message._id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', error: err.message });
  }
};

 
// Get all contact form submissions
exports.getAllContactForms = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;
    const query = {
      $or: [
        { First_Name: { $regex: search, $options: 'i' } },
        { Last_Name: { $regex: search, $options: 'i' } },
        { Email: { $regex: search, $options: 'i' } },
        { Subject: { $regex: search, $options: 'i' } },
      ],
    };
 
    const total = await ContactForm.countDocuments(query);
    const forms = await ContactForm.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
 
    res.status(200).json({ data: forms, total });
  } catch (err) {
    console.error('Error fetching contact forms:', err);
    res.status(500).json({ message: 'Failed to fetch contact forms' });
  }
};
 
// Get single contact form by ID
exports.getContactFormById = async (req, res) => {
  try {
    const form = await ContactForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Contact form not found' });
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// Delete contact form
exports.deleteContactForm = async (req, res) => {
  try {
    const form = await ContactForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Contact form not found' });
 
    await ContactForm.findByIdAndDelete(form._id);
    res.status(200).json({ message: 'Contact form deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete contact form', error: err.message });
  }
};

 