import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/authDB',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  port: process.env.PORT || 5001,
};
