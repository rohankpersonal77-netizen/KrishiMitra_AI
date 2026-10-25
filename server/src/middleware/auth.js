import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'krishimitra_super_secret_jwt_key_2026';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // If no auth token, check if optional demo user
    req.user = { id: 'farmer_demo_101', name: 'Ramesh Patil', email: 'ramesh.patil@krishimitra.ai', isDemo: true };
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  if (token.startsWith('demo_token') || token.startsWith('local_session')) {
    req.user = { id: 'farmer_demo_101', name: 'Ramesh Patil', email: 'ramesh.patil@krishimitra.ai', isDemo: true };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session token' });
  }
}
