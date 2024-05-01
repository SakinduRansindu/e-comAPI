// generate a JWT token
const jwt = require('jsonwebtoken');

const secret = 'secret' || process.env.JWT_SECRET;

function generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.constructor.name === 'User' ? 'user' : 'seller',};
      console.log("JWT",payload, secret)
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}

module.exports = generateToken;