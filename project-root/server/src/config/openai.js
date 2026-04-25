const { OpenAI } = require('openai');
require('dotenv').config();

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    apiKey: apiKey,
  });
};

module.exports = {
  getOpenAIClient,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ENABLE_MOCK_MODE: process.env.ENABLE_MOCK_MODE === 'true'
};
