/**
 * Development Server - Localhost Version
 * This is the original Node.js/Express backend for local development
 */

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Joke Generator API is running (Development)',
        timestamp: new Date().toISOString()
    });
});

/**
 * Generate joke endpoint
 */
app.post('/joke', async (req, res) => {
    try {
        const { input } = req.body;

        // Validate input
        if (!input || typeof input !== 'string') {
            return res.status(400).json({
                error: 'Input is required and must be a string'
            });
        }

        const trimmedInput = input.trim();
        if (trimmedInput.length === 0) {
            return res.status(400).json({
                error: 'Input cannot be empty'
            });
        }

        if (trimmedInput.length > 100) {
            return res.status(400).json({
                error: 'Input is too long (max 100 characters)'
            });
        }

        // Generate joke using Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `Generate a funny, clean joke related to or inspired by the word/phrase: "${trimmedInput}". 
        The joke should be appropriate for all audiences and should be creative and original. 
        Return only the joke text, no additional commentary.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const joke = response.text().trim();

        // Get token usage information
        const usageMetadata = response.usageMetadata;
        const promptTokens = usageMetadata?.promptTokenCount || 0;
        const candidatesTokens = usageMetadata?.candidatesTokenCount || 0;
        const totalTokens = usageMetadata?.totalTokenCount || 0;

        // Log token usage to console
        console.log(`🎭 Joke generated for "${trimmedInput}"`);
        console.log(`📊 Token Usage: ${promptTokens} input + ${candidatesTokens} output = ${totalTokens} total`);

        // Return the joke with token usage
        res.json({
            success: true,
            joke: joke,
            input: trimmedInput,
            timestamp: new Date().toISOString(),
            tokenUsage: {
                promptTokens: promptTokens,
                responseTokens: candidatesTokens,
                totalTokens: totalTokens
            }
        });

    } catch (error) {
        console.error('Error generating joke:', error);
        
        if (error.message.includes('API_KEY')) {
            return res.status(500).json({
                error: 'API key not configured properly'
            });
        }

        res.status(500).json({
            error: 'Failed to generate joke. Please try again.'
        });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Joke Generator API running on port ${PORT} (Development)`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🎭 Joke endpoint: http://localhost:${PORT}/joke`);
    
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
    }
});

module.exports = app;
