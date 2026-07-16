# Project Structure

```
project/
├── api/                    # Vercel Serverless Functions
│   ├── analyze-chart.ts    # Core analysis endpoint
│   └── health.ts           # Health check endpoint
├── lib/                    # Shared Backend Logic
│   ├── ai/                 # Gemini Client, Prompts, Parsers
│   ├── config/             # Environment & AI constants
│   ├── logger/             # Structured JSON logger
│   ├── utils/              # Error & Response helpers
│   └── validation/         # Image & Input validation
├── types/                  # Shared TypeScript Interfaces
├── src/                    # Frontend React Application
│   ├── components/         # Modular UI components
│   ├── lib/                # Frontend utilities
│   └── services/           # API communication layer
├── server.ts               # Native Node.js Local Dev Runner
├── package.json            # Dependencies & Build Scripts
└── tsconfig.json           # TS Configuration
```
