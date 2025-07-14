import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import promptRoutes from './routes/prompt.routes';
import adminRoutes from './routes/admin.routes';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
app.use(bodyParser.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/admin', adminRoutes);

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

export default app;
