const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    // Check for token in cookies first, then header (for backward compatibility during dev if needed)
    let token = req.cookies.token;

    // Optional: Fallback to header if you want to support both
    // if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    //    token = req.headers.authorization.split(' ')[1];
    // }

    if (!token) {
        return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
