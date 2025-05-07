require('dotenv').config({ path: '../.env' });
const OpenAI = require('openai');

const openaiClient = new OpenAI({
    apiKey: process.env['OPEN_ROUTER_API_KEY'],
    baseURL: 'https://openrouter.ai/api/v1',
});

module.exports = openaiClient;