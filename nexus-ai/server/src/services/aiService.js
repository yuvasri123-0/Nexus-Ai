const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using gemini-2.5-flash based on the user's API key availability
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
        throw new Error('AI Service Unavailable. Please try again later.');
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
        let responseText = await generateResponse(prompt, 2); // 2 retries for project builds
        
        // Robust JSON extraction
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
        console.error('Project Builder AI Error:', err.message);
        throw new Error('AI failed to build project. Please adjust your requirements and try again.');
    }
};

module.exports = { generateResponse, buildProject };
