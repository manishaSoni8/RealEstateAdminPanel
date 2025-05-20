const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent');
 

router.get('/agents', agentController.getAllAgents);
 router.get('/agents/:id', agentController.getAgentById);

router.post('/agents/create', agentController.createAgent);

router.patch('/agents/block/:id', agentController.blockAgent);
router.put('/agents/edit/:id', agentController.editAgent);
router.delete('/agents/:id', agentController.deleteAgent);
 
module.exports = router;