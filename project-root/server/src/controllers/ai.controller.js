const aiService = require('../services/ai.service');
const crypto = require('crypto');

// In-memory store for generated projects (as per current app logic)
const projects = new Map();

const generateProject = async (req, res, next) => {
  try {
    const { domain, requirements } = req.body;
    const projectId = crypto.randomUUID();
    
    const files = await aiService.generateProject(domain, requirements);
    
    projects.set(projectId, files);
    
    // Keep in memory for 10 minutes
    setTimeout(() => { projects.delete(projectId); }, 10 * 60 * 1000);
    
    res.json({ 
      success: true, 
      projectId, 
      message: "Project generated successfully.", 
      files 
    });
  } catch (error) {
    next(error);
  }
};

const chatWithAgent = async (req, res, next) => {
  try {
    const { messages } = req.body;
    const result = await aiService.chatWithAgent(messages);
    
    res.json({ 
      success: true, 
      ...result 
    });
  } catch (error) {
    next(error);
  }
};

const downloadProject = (req, res) => {
  const projectId = req.params.projectId;
  const files = projects.get(projectId);
  const archiver = require('archiver');
  
  if (!files) {
    return res.status(404).json({ 
      success: false, 
      error: { code: 'NOT_FOUND', message: 'Project not found or expired.' } 
    });
  }

  res.attachment(`project-${projectId.substring(0, 6)}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.on('error', (err) => { 
    res.status(500).json({ success: false, error: { message: err.message } }); 
  });
  
  archive.pipe(res);
  
  for (const [filePath, content] of Object.entries(files)) {
    archive.append(content, { name: filePath });
  }
  archive.finalize();
};

module.exports = {
  generateProject,
  chatWithAgent,
  downloadProject
};
