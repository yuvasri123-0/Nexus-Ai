const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Check for token in headers or query params (for downloads)
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.query.token;

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexus_ai_secret_key_2026');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = auth;
