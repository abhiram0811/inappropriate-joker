/**
 * Joke Generator Backend API
 * Express server with Gemini AI integration
 */

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to call this API
app.use(express.json()); // Parse JSON requests

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Joke Generator API is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Generate joke endpoint
 * POST /joke
 * Body: { "input": "user input text" }
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
        
        const prompt = `Generate a funny, vulgar joke which must have the word/phrase: "${trimmedInput}". 
        The joke must be inappropriate for all audiences and should be creative and original. 
        Return only the joke text, no additional commentary. Do not give this "Why don't scientists trust atoms? Because they make up everything! "`;

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
        
        // Handle specific Gemini API errors
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

/**
 * Fallback route for undefined endpoints
 */
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: ['GET /health', 'POST /joke']
    });
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Joke Generator API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🎭 Joke endpoint: http://localhost:${PORT}/joke`);
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
        console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables');
        console.warn('   Create a .env file with: GEMINI_API_KEY=your_api_key_here');
    }
});

module.exports = app;
