const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.post('/generate', aiController.generateProject);
router.post('/chat', aiController.chatWithAgent);
router.get('/download/:projectId', aiController.downloadProject);

module.exports = router;
