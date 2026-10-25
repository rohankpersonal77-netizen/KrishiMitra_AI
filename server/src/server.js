import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[KrishiMitra Backend] Server operational on port ${PORT}`);
    console.log(`[KrishiMitra Backend] API Base: http://localhost:${PORT}/api/health`);
  });
}

startServer();
