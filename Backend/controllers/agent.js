const User = require('../models/user');
const UserType = require('../models/userType');
const PropertyData = require('../models/propertyData');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
 
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: { api_key: process.env.SENDGRID_API_KEY }
}));
 
// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agentType = await UserType.findOne({ user_type_name: 'agent' });
    if (!agentType) return res.status(404).json({ message: 'Agent type not found' });
 
    const agents = await User.find({ user_type_id: agentType._id });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agents' });
  }
};
 exports.getAgentById= async (req, res) => {
         try {
            const agentType = await UserType.findOne({ user_type_name: 'agent' });
             const agent = await User.findOne({ _id: req.params.id, user_type_id: agentType._id }).populate('is_subscribed');
             
             if (!agent) {
                 return res.status(404).json({ message: 'Admin not found' });
             }
             res.json(agent);
         } catch (error) {
             res.status(500).json({ message: error.message });
         }
     };
// Create new agent
exports.createAgent = async (req, res) => {
  const { First_Name, Last_Name, Email, Password, Phone } = req.body;
 
  try {
    const existingUser = await User.findOne({ Email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });
 
    const userType = await UserType.findOne({ user_type_name: 'agent' });
    if (!userType) return res.status(400).json({ message: 'Agent type not found' });
 
    const hashedPassword = await bcrypt.hash(Password, 10);
    const token = crypto.randomBytes(20).toString('hex');
 
    const newUser = new User({
      First_Name,
      Last_Name,
      Email,
      Password: hashedPassword,
      Phone,
      user_type_id: userType._id,
      status: true,
      resetToken: token,
    });
 
    await newUser.save();
 
    await transporter.sendMail({
      to: Email,
      from: 'balajipathak@startbitsolutions.com',
      subject: 'Credential for Agent Login',
      html: `<p>Hello ${First_Name},<br>Your agent account has been created.<br><strong>Email:</strong> ${Email}<br><strong>Password:</strong> ${Password}</p>`,
    });
 
    res.status(201).json({ message: 'Agent created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create agent' });
  }
};

exports.blockAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const agent = await User.findById(id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
 
    // Toggle status
    agent.is_blocked = !agent.is_blocked;
    await agent.save();
 
    const action = !agent.is_blocked ? 'unblocked' : 'Blocked';
 
    // Send email to agent
    
    await transporter.sendMail({
      to: agent.Email,
      from: 'balajipathak@startbitsolutions.com',
      subject:'Agent Account Permissions',
      html:`
      <p>Hello ${agent.First_Name},</p>
      <p>Your agent account has been <strong>${action}</strong> by the administrator.</p>
      <p>If you have any questions, feel free to contact support.</p>
      <p>Regards,<br/>Real Estate Admin</p>
    `
    });
 
    res.status(200).json({ message: `Agent has been ${action}.` });
  } catch (err) {
    console.error('Error in blockAgent:', err);
    res.status(500).json({ message: 'Failed to update agent status' });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const agentType = await UserType.findOne({ user_type_name: 'agent' });
 
const agent = await User.findOne({ _id: req.params.id, user_type_id: agentType._id });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
 await transporter.sendMail({
      to: agent.Email,
      from: 'balajipathak@startbitsolutions.com',
      subject:'Your Agent Account has been Deleted',
      html:`
      <p>Hello ${agent.First_Name},</p>
      <p>Your agent account has been <strong>Deleted</strong> by the administrator.</p>
      <p>If you have any questions, feel free to contact support.</p>
      <p>Regards,<br/>Real Estate Admin</p>
    `
    });
    await User.findByIdAndDelete(agent._id);
    res.json({ message: 'Agent deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  
};

exports.editAgent = async (req, res) => {
  const { First_Name, Last_Name, Email, Phone } = req.body;
 
  try {
    const agent = await User.findByIdAndUpdate(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
 
    // Optional fields – only update if provided
    if (First_Name) agent.First_Name = First_Name;
    if (Last_Name) agent.Last_Name = Last_Name;
    if (Email) agent.Email = Email;
    if (Phone) agent.Phone = Phone;
   
    await agent.save();
 
    res.status(200).json({ message: 'Agent updated successfully', agent });
 
  } catch (error) {
    res.status(500).json({ message: 'Failed to update agent', error: error.message });
  }
};
exports.getPropertiesByAgent = async (req, res) => {
  try {
const properties = await PropertyData.find({ userId: req.params.id });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties by agent:', error);
    res.status(500).json({ message: 'Failed to fetch agent properties' });
  }
};