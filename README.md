# Antrovex AI Market Analyzer

A professional, production-ready AI-powered trading chart analysis platform. Built with React, TypeScript, and Google Gemini Vision.

## 🚀 Features

- **AI-Powered Analysis**: Uses Gemini Vision to decode market trends, structure (BOS/CHOCH), and technical patterns.
- **Structured Data**: Returns professional analysis including liquidity zones, FVG, and order blocks.
- **Modern UI**: Dark-themed, responsive dashboard with drag-and-drop upload.
- **Serverless Ready**: Built with a modular architecture compatible with Vercel Serverless Functions.
- **Secure**: Robust input validation and secure API handling.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Motion.
- **Backend**: TypeScript, Native Node.js (Vercel-compatible functions).
- **AI**: Google Gemini 1.5 Flash.

## 📁 Project Structure

- `api/`: Vercel serverless function handlers.
- `lib/`: Shared backend utilities (AI, validation, config).
- `src/`: Frontend application code.
- `types/`: Shared TypeScript definitions.

## 📝 Environment Setup

Create a `.env` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

## 🚀 Deployment

The project is designed to be deployed directly to **Vercel** with zero configuration required other than the environment variables.

1. Connect your GitHub repository to Vercel.
2. Add `GEMINI_API_KEY` to the project's environment variables.
3. Vercel will automatically detect the `api/` directory and deploy the serverless functions.

---
*Disclaimer: For educational purposes only. Trading involves risk.*
