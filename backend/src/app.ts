import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path'; 
import favicon from 'serve-favicon'; 

import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import logger from './utils/logger';

import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import promptRoutes from './routes/prompt.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';

console.log('1. Starting app.ts - Before dotenv.config()');
dotenv.config();
console.log('1.1. After dotenv.config()');

console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? 'Loaded' : 'NOT LOADED'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED'}`);
console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'Loaded' : 'NOT LOADED'}`);
console.log(`PORT (from env): ${process.env.PORT}`);
console.log(`CORS_ORIGIN (from env): ${process.env.CORS_ORIGIN}`);

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'; 
const corsOptions = {
  origin: allowedOrigin, 
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet());

app.use(favicon(path.join(__dirname, 'favicon.ico')));


app.use('/api/', apiLimiter);

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
