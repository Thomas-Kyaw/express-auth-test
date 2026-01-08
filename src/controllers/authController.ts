import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/user';
import { config } from '../config/config';

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const secret = config.jwtSecret
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as Exclude<SignOptions['expiresIn'], undefined> });

    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password -__v');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'Welcome to the user dashboard', user });
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password -__v');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'Welcome to the admin dashboard', user });
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};
