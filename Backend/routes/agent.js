const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent');
 

router.get('/agents', agentController.getAllAgents);
 router.get('/agents/:id', agentController.getAgentById);

router.post('/agents/create', agentController.createAgent);

router.patch('/agents/block/:id', agentController.blockAgent);

module.exports = router;