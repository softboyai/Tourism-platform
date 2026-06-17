const jwt = require('jsonwebtoken');

/**
 * Middleware to verify user JWT token
 */
const verifyUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Please log in first.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Must be a user token (not admin)
    if (decoded.role !== 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. User account required.'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: 'Token expired.' });
    }
    return res.status(401).json({ status: 'error', message: 'Invalid token.' });
  }
};

module.exports = verifyUserToken;
