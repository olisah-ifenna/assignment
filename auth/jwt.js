const jwt = require('jsonwebtoken');

// Define the secret key
const secretKey ='EGYYZCfpaOxOX6ivbcfqqVIBakw';

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];
    if (!token) {
        return res.status(403).send('Token is missing');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the decoded payload to the request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).send('Token is invalid');
        } else {
            return res.status(401).send('Token verification failed');
        }
    }
};

// Signing a token (This can be done during login or registration)
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Example:
const payload = { userId: 12345, username: 'exampleUser', role: 'admin' };
const token = generateToken(payload);
console.log('Generated Token:', token);

// Verifying the token directly (for testing purposes)
try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded Payload:', decoded);
} catch (error) {
    if (error.name === 'TokenExpiredError') {
        console.error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
        console.error('Token is invalid');
    } else {
        console.error('Token verification failed:', error.message);
    }
}

// Export the middleware
module.exports = {
    verifyToken,
    generateToken,
};
