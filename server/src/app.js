import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Endpoints
app.use('/api', apiRoutes);

// In production, serve the built frontend
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// Catch-all for React SPA routing
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      // In dev mode when client isn't built yet, return simple message
      res.json({ message: 'KrishiMitra AI API is active. Access client at http://localhost:5173' });
    }
  });
});

export default app;
