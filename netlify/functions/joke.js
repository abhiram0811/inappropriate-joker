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
        
        const prompt = `Create a spicy, adult-oriented comedic response based on the concept or theme of: "${trimmedInput}". 

        Style Guidelines:
        - Interpret the deeper meaning or context behind the input, not just literal words
        - Channel late-night comedy show energy - bold, cheeky, and unapologetically mature
        - Use clever wordplay, double entendres, and suggestive humor
        - Include adult situations, romantic mishaps, or bedroom comedy themes
        - Make it risqué with innuendo and mature themes that adults would find amusing
        - Think "R-rated comedy special" rather than family-friendly
        - Build narrative tension or setup/punchline structure if it enhances the humor
        - Be witty, shocking, and memorable while maintaining comedic sophistication
        - Target audience: adults who enjoy edgy, provocative humor
        
        Deliver just the comedic content - no explanations needed.`;

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
