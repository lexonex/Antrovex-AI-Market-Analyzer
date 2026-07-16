import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import sirv from 'sirv';
import compression from 'compression';

// Import our handlers
// Note: We'll use dynamic imports or static ones. Static is better for bundling.
import healthHandler from './api/health';
import analyzeHandler from './api/analyze-chart';

const PORT = 3000;

async function start() {
  const isProduction = process.env.NODE_ENV === 'production';
  let vite: any;
  let assets: any;
  let compress: any;

  if (isProduction) {
    assets = sirv(path.join(process.cwd(), 'dist'), {
      single: true,
      dev: false
    });
    compress = compression();
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

  const server = http.createServer(async (req, res) => {
    // 1. Route API requests
    if (req.url?.startsWith('/api/')) {
      // Enhance res with Vercel-like methods
      const vercelRes = res as any;
      vercelRes.status = (code: number) => {
        res.statusCode = code;
        return vercelRes;
      };
      vercelRes.json = (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      };

      // Simple body parser for POST
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            (req as any).body = body ? JSON.parse(body) : {};
            
            if (req.url === '/api/analyze-chart') {
              await analyzeHandler(req as any, vercelRes);
            } else {
              res.statusCode = 404;
              res.end('Not Found');
            }
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }

      if (req.url === '/api/health' && req.method === 'GET') {
        return healthHandler(req as any, vercelRes);
      }

      res.statusCode = 404;
      res.end('Not Found');
      return;
    }

    // 2. Serve static files in production or use Vite in development
    if (isProduction) {
      compress(req as any, res as any, () => {
        assets(req, res);
      });
    } else {
      vite.middlewares(req, res);
    }
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`> Antrovex AI Market Analyzer running at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
