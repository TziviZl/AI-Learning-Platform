import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import promptRoutes from './routes/prompt.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet());
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
  logger.info(`Server running on port ${PORT}`);
});

export default app;
