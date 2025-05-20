const User = require('../models/user');
const UserType = require('../models/UserType');
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
 
// Block or Unblock agent
// Block or Unblock agent
exports.blockAgent = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
 
    // Toggle status
    agent.status = !agent.status;
 
    // Set isBlocked based on status
    agent.is_blocked = !agent.status; 
 
    await agent.save();
 
    // Send email notification
    const action = agent.status ? 'unblocked' : 'blocked';
    const subject = `Your Agent Account has been ${action}`;
    const message = `
      <p>Hello ${agent.First_Name},</p>
      <p>Your agent account has been <strong>${action}</strong> by the administrator.</p>
      <p>If you have any questions, feel free to contact support.</p>
      <p>Regards,<br>Real Estate Admin</p>
    `;
 
    await transporter.sendMail({
      to: agent.Email,
      from: 'balajipathak@startbitsolutions.com',
      subject,
      html: message,
    });
 
    res.json({ message: `Agent ${action} successfully`, agent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating agent status' });
  }
};

 