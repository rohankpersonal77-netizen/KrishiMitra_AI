import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'krishimitra_super_secret_jwt_key_2026';

// In-memory fallback users store
const memoryUsers = [
  {
    _id: 'farmer_demo_101',
    name: 'Ramesh Patil',
    email: 'ramesh.patil@krishimitra.ai',
    passwordHash: bcrypt.hashSync('password123', 8),
    phone: '+91 98220 12345',
    preferredLanguage: 'en',
    state: 'Maharashtra',
    district: 'Nashik',
    isDemo: true,
  },
];

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          preferredLanguage: user.preferredLanguage,
          state: user.state,
          district: user.district,
          isDemo: user.isDemo,
        },
      });
    } else {
      // In-memory fallback
      let user = memoryUsers.find((u) => u.email === normalizedEmail);
      if (!user && (normalizedEmail.includes('demo') || normalizedEmail.includes('ramesh'))) {
        user = memoryUsers[0];
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          preferredLanguage: user.preferredLanguage,
          state: user.state,
          district: user.district,
          isDemo: user.isDemo,
        },
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server authentication error' });
  }
}

export async function signup(req, res) {
  try {
    const { fullName, email, password, phone, preferredLanguage, state, district } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMongoConnected) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const newUser = await User.create({
        name: fullName,
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone || '',
        preferredLanguage: preferredLanguage || 'en',
        state: state || 'Maharashtra',
        district: district || 'Nashik',
      });

      const token = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          preferredLanguage: newUser.preferredLanguage,
          state: newUser.state,
          district: newUser.district,
          isDemo: false,
        },
      });
    } else {
      // In-memory fallback
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: fullName,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        phone: phone || '',
        preferredLanguage: preferredLanguage || 'en',
        state: state || 'Maharashtra',
        district: district || 'Nashik',
        isDemo: false,
      };
      memoryUsers.push(newUser);

      const token = jwt.sign(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          preferredLanguage: newUser.preferredLanguage,
          state: newUser.state,
          district: newUser.district,
          isDemo: false,
        },
      });
    }
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Registration server error' });
  }
}

export function me(req, res) {
  res.json({ user: req.user });
}
