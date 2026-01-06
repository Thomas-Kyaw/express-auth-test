import mongoose from 'mongoose';
import app from './app';
import { config } from './config/config';

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

start();
