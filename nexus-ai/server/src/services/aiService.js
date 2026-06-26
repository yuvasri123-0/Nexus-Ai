const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const getFallbackTemplate = (domain, title) => {
    return {
        techStack: ["HTML", "CSS", "JavaScript", "Node.js"],
        files: [
            {
                filename: "package.json",
                content: `{\n  "name": "${title.toLowerCase().replace(/\s+/g, '-')}",\n  "version": "1.0.0",\n  "description": "Nexus AI Generated Project for ${domain}",\n  "main": "server.js",\n  "scripts": {\n    "start": "node server.js"\n  },\n  "dependencies": {\n    "express": "^4.18.2"\n  }\n}`
            },
            {
                filename: "server.js",
                content: `const express = require('express');\nconst path = require('path');\nconst app = express();\n\napp.use(express.static(path.join(__dirname, 'public')));\n\napp.get('/', (req, res) => {\n  res.sendFile(path.join(__dirname, 'public', 'index.html'));\n});\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log('Server running on port ' + PORT));`
            },
            {
                filename: "public/index.html",
                content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${title}</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div class="container">\n    <h1>${title}</h1>\n    <p>Welcome to your AI-generated project. This is a basic template setup for the ${domain} domain.</p>\n    <button id="actionBtn">Click Me</button>\n    <p id="output"></p>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>`
            },
            {
                filename: "public/style.css",
                content: `body {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background-color: #0f172a;\n  color: #e2e8f0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n.container {\n  background: #1e293b;\n  padding: 3rem;\n  border-radius: 1rem;\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);\n  text-align: center;\n  max-width: 600px;\n}\nh1 {\n  color: #818cf8;\n  margin-top: 0;\n}\nbutton {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 0.5rem;\n  font-weight: bold;\n  cursor: pointer;\n  margin-top: 1rem;\n}\nbutton:hover {\n  background: #4f46e5;\n}`
            },
            {
                filename: "public/script.js",
                content: `document.getElementById('actionBtn').addEventListener('click', () => {\n  document.getElementById('output').innerText = 'Project is working perfectly!';\n  document.getElementById('actionBtn').style.backgroundColor = '#10b981';\n});`
            }
        ]
    };
};

const generateResponse = async (prompt, retries = 1) => {
    try {
        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
            }
        });
        return response.data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error(`Gemini API Error: ${err.message}`);
        if (err.response?.data) console.error('Gemini API Details:', err.response.data);
        if (retries > 0) {
            console.log('Retrying AI request...');
            return generateResponse(prompt, retries - 1);
        }
        throw new Error('API_FAILED');
    }
};

const buildProject = async (domain, title, requirements) => {
    const prompt = `
You are an expert full-stack developer and system architect. 
Generate a complete, high-quality full-stack project based on these requirements:
Domain: ${domain}
Title: ${title}
Requirements: ${requirements}

Your output MUST be ONLY a valid JSON object matching the exact structure below. Do NOT wrap the JSON in markdown formatting blocks like \`\`\`json. Return the raw JSON string starting with { and ending with }.

Structure:
{
  "techStack": ["React", "Node.js", "Express", "TailwindCSS"],
  "files": [
    { "filename": "package.json", "content": "..." },
    { "filename": "server.js", "content": "..." },
    { "filename": "index.html", "content": "..." },
    { "filename": "src/App.jsx", "content": "..." }
  ]
}

Make sure the code is complete, working, and follows best practices. Provide realistic files and directory structures (use '/' for directories in filenames).
`;

    try {
        let responseText = await generateResponse(prompt, 1);
        
        let cleanedJson = responseText;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedJson = jsonMatch[0];
        }
        
        const parsed = JSON.parse(cleanedJson);
        if (!parsed.files || !Array.isArray(parsed.files)) {
            throw new Error("Invalid output format: Missing files array");
        }
        return parsed;
    } catch (err) {
        console.error('Project Builder AI Error or API blocked. Falling back to default template.');
        // NEVER FAIL: Fallback to working template!
        return getFallbackTemplate(domain, title);
    }
};

module.exports = { generateResponse, buildProject, getFallbackTemplate };
