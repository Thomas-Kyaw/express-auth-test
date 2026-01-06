import express from 'express';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Error handling
app.use(errorHandler);

export default app;
