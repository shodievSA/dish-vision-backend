const OpenAI = require('openai');

const imagenClient = new OpenAI({
    apiKey: process.env['GEMINI_API_KEY'],
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

module.exports = imagenClient;