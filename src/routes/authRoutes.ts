import express from 'express';
import { body } from 'express-validator';
import { register, login, getUser, getAdmin } from '../controllers/authController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  register
);

router.post('/login', login);

router.get('/user', authMiddleware, getUser);

router.get('/admin', authMiddleware, roleMiddleware('admin'), getAdmin);

export default router;
