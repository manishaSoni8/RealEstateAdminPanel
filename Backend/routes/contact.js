const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
 

router.get('/contactforms', contactController.getAllContactForms);             
router.get('/contactforms/:id', contactController.getContactFormById);       
router.delete('/contactforms/:id', contactController.deleteContactForm);      
 
// Agent Message Routes
router.get('/agentmessages', contactController.getAllAgentMessages);          
router.get('/agentmessages/:id', contactController.getAgentMessageById);      
router.delete('/agentmessages/:id', contactController.deleteAgentMessage);    
 
module.exports = router;