// API Configuration - Use Netlify Functions
const API_BASE_URL = '/.netlify/functions';

// Get DOM elements
const form = document.getElementById('jokeForm');
const input = document.getElementById('userInput');
const jokeOutput = document.getElementById('jokeOutput');
const jokeText = document.getElementById('jokeText');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Show joke with token usage
function showJoke(joke, tokenUsage) {
    jokeOutput.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Display joke and token usage (with fallback if tokenUsage is missing)
    let jokeWithTokens = joke;
    
    if (tokenUsage && typeof tokenUsage === 'object') {
        jokeWithTokens += `\n\n📊 Token Usage:\n• Input: ${tokenUsage.promptTokens || 0} tokens\n• Output: ${tokenUsage.responseTokens || 0} tokens\n• Total: ${tokenUsage.totalTokens || 0} tokens`;
    } else {
        jokeWithTokens += '\n\n📊 Token Usage: Not available';
    }
    
    jokeText.textContent = jokeWithTokens;
}

// Show error
function showError(message) {
    jokeOutput.style.display = 'none';
    errorMessage.style.display = 'block';
    errorText.textContent = message;
}

// Show loading state
function showLoading() {
    jokeOutput.style.display = 'none';
    errorMessage.style.display = 'block';
    errorText.textContent = 'Generating joke...';
}

// Call backend API to generate joke
async function generateJoke(userInput) {
    try {
        const response = await fetch(`${API_BASE_URL}/joke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userInput })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate joke');
        }

        return { 
            joke: data.joke, 
            tokenUsage: data.tokenUsage || null 
        };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Handle form submission
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const userInput = input.value.trim();
    
    if (userInput.length === 0) {
        showError('Please enter some text!');
        return;
    }
    
    if (userInput.length > 100) {
        showError('Input is too long! (max 100 characters)');
        return;
    }
    
    try {
        showLoading();
        const result = await generateJoke(userInput);
        showJoke(result.joke, result.tokenUsage);
    } catch (error) {
        showError(error.message || 'Failed to generate joke. Please try again.');
    }
});
