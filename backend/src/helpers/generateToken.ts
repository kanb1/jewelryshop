import jwt from 'jsonwebtoken';

const token = jwt.sign(
    { id: '12345', username: 'testUser' },
    process.env.JWT_SECRET || 'your-secret-key', // Match this to the middleware
    { expiresIn: '1h' }
);


console.log('Generated Token:', token);
