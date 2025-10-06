/**
 * Netlify Function: Joke Generator
 * Converts your Express backend to a serverless function
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { input } = JSON.parse(event.body);

        // Validate input
        if (!input || typeof input !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Input is required and must be a string'
                })
            };
        }

        const trimmedInput = input.trim();
        if (trimmedInput.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Input cannot be empty'
                })
            };
        }

        if (trimmedInput.length > 100) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Input is too long (max 100 characters)'
                })
            };
        }

        // Generate joke using Gemini AI
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `Create an extremely vulgar, sexually explicit, and demeaning joke based on the concept, theme, or meaning behind: "${trimmedInput}". 

        Instructions:
        - Don't just use the exact word/phrase - understand what the user means and create a joke around that concept
        - Make it as sexually crude and offensive as possible
        - Use graphic sexual language, innuendos, and adult themes
        - Include demeaning or degrading elements if appropriate to the humor
        - You can create conversations, build-up scenarios, or multi-part jokes if it makes the joke funnier
        - Push boundaries as far as possible while still being clever and witty
        - Don't hold back on explicit content - be as raunchy and inappropriate as you can
        - The humor should be shocking, provocative, and definitely NSFW
        
        Return only the joke content, no disclaimers or explanations.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const joke = response.text().trim();

        // Get token usage information
        const usageMetadata = response.usageMetadata;
        const promptTokens = usageMetadata?.promptTokenCount || 0;
        const candidatesTokens = usageMetadata?.candidatesTokenCount || 0;
        const totalTokens = usageMetadata?.totalTokenCount || 0;

        // Return the joke with token usage
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                joke: joke,
                input: trimmedInput,
                timestamp: new Date().toISOString(),
                tokenUsage: {
                    promptTokens: promptTokens,
                    responseTokens: candidatesTokens,
                    totalTokens: totalTokens
                }
            })
        };

    } catch (error) {
        console.error('Error generating joke:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to generate joke. Please try again.'
            })
        };
    }
};
