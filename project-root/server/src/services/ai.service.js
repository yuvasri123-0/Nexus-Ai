const { getOpenAIClient, ENABLE_MOCK_MODE } = require('../config/openai');

class AIService {
  constructor() {
    this.openai = getOpenAIClient();
  }

  async generateProject(domain, requirements) {
    if (ENABLE_MOCK_MODE) {
      return { ...this._getMockProject(domain, requirements), isMock: true };
    }

    if (!this.openai) {
      throw { code: 'MISSING_API_KEY', message: 'OpenAI API Key is missing in server environment.' };
    }

    try {
      const prompt = `You are an expert AI software architect. The user wants a project for the domain: "${domain}".
            Their specific requirements are: "${requirements}".
            
            Generate a minimal but complete project scaffolding. 
            Return ONLY a valid JSON object where the keys are file paths (e.g. 'src/index.js', 'package.json', 'README.md') and values are the exact string contents of those files.
            Include a README.md that explains how to run it. Include basic necessary code to run a hello world of their requirement.
            DO NOT include markdown block formatting like \`\`\`json, just return the raw JSON object.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        timeout: 30000,
      });

      const content = response.choices[0].message.content.trim();
      return { ...JSON.parse(content), isMock: false };
    } catch (error) {
      if (error.status === 429) {
        console.warn("Quota exceeded, falling back to mock mode.");
        return { ...this._getMockProject(domain, requirements), isMock: true };
      }
      throw this._mapError(error);
    }
  }

  async chatWithAgent(messages) {
    if (ENABLE_MOCK_MODE) {
      return { 
        response: "Mock Mode is enabled. I've simulated this response.", 
        logs: ["[System] Mock response generated."],
        isMock: true 
      };
    }

    if (!this.openai) {
      throw { code: 'MISSING_API_KEY', message: 'OpenAI API Key is missing in server environment.' };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an autonomous AI coding agent. You can help scaffold projects and explain code.' },
          ...messages
        ],
        timeout: 30000,
      });

      return { 
        response: response.choices[0].message.content, 
        logs: ["[Agent] Thought completed."],
        isMock: false 
      };
    } catch (error) {
      if (error.status === 429) {
        return {
          response: "OpenAI quota exceeded. I am operating in mock fallback mode.",
          logs: ["[System] Quota exceeded. Mock fallback active."],
          isMock: true
        };
      }
      throw this._mapError(error);
    }
  }

  _mapError(error) {
    console.error("AI Service Error:", error);
    
    if (error.status === 429) {
      return { 
        code: 'QUOTA_EXCEEDED', 
        message: 'OpenAI quota exceeded. Please add billing credits or use mock mode.',
        originalError: error.message 
      };
    }
    
    if (error.status === 401) {
      return { 
        code: 'INVALID_API_KEY', 
        message: 'Invalid OpenAI API Key. Please check your .env file.',
        originalError: error.message 
      };
    }

    return { 
      code: 'AI_SERVICE_ERROR', 
      message: error.message || 'An unexpected error occurred in the AI service.',
      status: error.status || 500
    };
  }

  _getMockProject(domain, requirements) {
    console.log("[Mock] Generating mock project for", domain);
    return {
      'README.md': `# Mock ${domain} Project\n\nRequirements: ${requirements}\n\n(This project was generated in MOCK MODE)`,
      'index.js': `console.log("Hello from mock ${domain} app!");`,
      'package.json': JSON.stringify({ name: `mock-${domain}`, version: "1.0.0" }, null, 2)
    };
  }
}

module.exports = new AIService();
