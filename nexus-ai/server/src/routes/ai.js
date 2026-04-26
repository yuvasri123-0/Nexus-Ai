const express = require('express');
const fs = require('fs');
const path = require('path');
const { generateResponse, buildProject } = require('../services/aiService');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

// Chat with AI Agent
router.post('/chat', auth, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, error: 'Message is required' });

        const response = await generateResponse(message);
        res.json({ success: true, response });
    } catch (err) {
        // Fallback response handling as requested
        console.error('Agent error:', err.message);
        res.status(500).json({ success: false, error: err.message, response: "I'm sorry, I am currently experiencing high latency with my core processors. Could you please try your request again?" });
    }
});

// Build Project
router.post('/build', auth, async (req, res) => {
    try {
        const { domain, title, requirements } = req.body;
        if (!domain || !title || !requirements) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // 1. Generate project using AI
        const generatedProject = await buildProject(domain, title, requirements);

        // 2. Setup initial project entry to get ID
        const newProject = new Project({
            title,
            description: requirements,
            techStack: generatedProject.techStack,
            files: generatedProject.files,
            userId: req.user.id,
            status: 'running'
        });

        const savedProject = await newProject.save();

        // 3. Write files physically to disk (as requested)
        const projectDir = path.join(__dirname, '..', '..', 'projects', savedProject._id.toString());
        
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir, { recursive: true });
        }

        for (const file of generatedProject.files) {
            if (!file.filename || !file.content) continue;
            
            const fullPath = path.join(projectDir, file.filename);
            const dirPath = path.dirname(fullPath);
            
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(fullPath, file.content);
        }

        // 4. Update status and file path
        savedProject.status = 'completed';
        savedProject.filePath = projectDir;
        await savedProject.save();

        res.status(201).json(savedProject);
    } catch (err) {
        console.error('Build route error:', err);
        res.status(500).json({ error: err.message || 'AI failed to build project' });
    }
});

module.exports = router;
