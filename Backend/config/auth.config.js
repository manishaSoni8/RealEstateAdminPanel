const callbackbaseURL = process.env.BASE_URL || 'http://localhost:3005'; 
module.exports = {
    jwt: {
        secret: 'your-jwt-secret-key',
        expiresIn: '24h'
    }
};