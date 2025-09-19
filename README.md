# Joke Generator

AI-powered joke generator using Gemini API with Netlify Functions deployment.

## Features

- 🎭 AI-generated jokes using Gemini API
- 📊 Token usage tracking
- ⚡ Serverless backend with Netlify Functions
- 📱 Responsive design
- 🧹 Clean, production-ready code

## How to Deploy

1. **Connect to Netlify:**
   - Go to [Netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Select the `production` branch

2. **Add Environment Variables:**
   - `GEMINI_API_KEY` = your Gemini API key

3. **Deploy:**
   - Netlify will automatically deploy your app
   - Your app will be available at `https://your-app-name.netlify.app`

## Project Structure

```
├── index.html              # Frontend
├── styles.css              # Frontend styling
├── script.js               # Frontend JavaScript
├── netlify/
│   └── functions/
│       └── joke.js         # Netlify Function
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Open in browser:**
   ```bash
   # Open index.html in your browser
   # The app will use Netlify Functions when deployed
   ```

## Environment Variables

Create `.env` file for local development:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Netlify Functions (serverless)
- **AI:** Google Gemini API
- **Deployment:** Netlify

## Cost

- **Netlify Functions:** Free tier (125k calls/month)
- **Gemini API:** Free tier available
- **Total:** $0/month for personal use
