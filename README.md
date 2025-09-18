# Joke Generator

AI-powered joke generator using Gemini API with multiple deployment options.

## 🌿 Branch Structure

- **`main`** - Production version (Netlify deployment)
- **`development`** - Localhost version (Node.js backend)
- **`production`** - Netlify Functions version

## 🚀 Quick Start

### Development (Localhost)
```bash
# Switch to development branch
git checkout development

# Install dependencies
npm install

# Start backend server
npm start

# Open index.html in browser
# Make sure to use script-dev.js for development
```

### Production (Netlify)
```bash
# Switch to main branch
git checkout main

# Deploy to Netlify
# Connect GitHub repo to Netlify
# Add GEMINI_API_KEY environment variable
```

## 📁 Project Structure

```
joke-generator/
├── index.html              # Frontend
├── styles.css              # Frontend styling
├── script.js               # Production frontend (Netlify Functions)
├── script-dev.js           # Development frontend (localhost)
├── server-dev.js           # Development backend (Node.js)
├── package.json            # Production dependencies
├── package-dev.json        # Development dependencies
├── netlify/
│   └── functions/
│       └── joke.js         # Netlify Function
├── netlify.toml            # Netlify configuration
└── README.md               # This file
```

## 🔧 Environment Variables

Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

## 🎯 Features

- AI-generated jokes using Gemini API
- Token usage tracking
- Error handling
- Responsive design
- Multiple deployment options

## 📚 Git Workflow

1. **Development:** Work on `development` branch
2. **Testing:** Test locally with Node.js backend
3. **Production:** Merge to `main` for Netlify deployment
4. **Pull Requests:** Use PRs for code review

## 🚀 Deployment

- **Development:** Localhost with Node.js
- **Production:** Netlify with serverless functions