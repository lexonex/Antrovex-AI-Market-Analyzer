import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Import handlers from /api
// Note: We use relative imports with .js extension for NodeNext compatibility
import healthHandler from './api/health.js';
import analyzeHandler from './api/analyze-chart.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON body parsing
  app.use(express.json({ limit: '10mb' }));

  // API Routes - mimicking Vercel's /api folder
  app.get('/api/health', (req, res) => healthHandler(req as any, res as any));
  app.post('/api/analyze-chart', (req, res) => analyzeHandler(req as any, res as any));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving (for shared links in AI Studio)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
