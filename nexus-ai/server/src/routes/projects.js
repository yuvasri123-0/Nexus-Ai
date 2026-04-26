const express = require('express');
const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const archiver = require('archiver');
const router = express.Router();

// Get all projects for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create project manually
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, techStack, files } = req.body;
        const newProject = new Project({
            title,
            description,
            techStack,
            files,
            userId: req.user.id
        });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Download ZIP
router.get('/:id/download', auth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const safeTitle = project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        // Define paths
        const zipDir = path.join(__dirname, '..', '..', 'downloads');
        if (!fs.existsSync(zipDir)) {
            fs.mkdirSync(zipDir, { recursive: true });
        }
        
        const zipPath = path.join(zipDir, `${safeTitle}_${project._id}.zip`);

        // If the ZIP already exists, just send it
        if (fs.existsSync(zipPath)) {
            return res.download(zipPath, `${safeTitle}.zip`);
        }

        // Otherwise create it
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            // Once the zip is created on disk, send it using res.download
            res.download(zipPath, `${safeTitle}.zip`);
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        // Append files from DB (which is safer than relying on folder structure being intact)
        if (project.files && Array.isArray(project.files)) {
            project.files.forEach(file => {
                if (file.filename && file.content) {
                    archive.append(file.content, { name: file.filename });
                }
            });
        } else if (project.filePath && fs.existsSync(project.filePath)) {
            // Fallback to reading the physical directory if DB files are somehow missing
            archive.directory(project.filePath, false);
        } else {
            // No files to zip
            archive.append('// No files generated', { name: 'empty.txt' });
        }

        archive.finalize();
    } catch (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate ZIP' });
        }
    }
});

module.exports = router;
