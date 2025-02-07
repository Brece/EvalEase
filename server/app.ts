import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';

import connectDB from './database/db';
import Router from './routes/api';

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB 🚀
if (process.env.MOCK_DB?.toLocaleLowerCase() !== 'true') {
  console.log('Connecting to LIVE database...');
  connectDB();
} else {
  console.log('Connecting to MOCK database...');
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Serve static files from Vite's build directory only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
  });
}

// Routes
app.use('/api/v1', Router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
