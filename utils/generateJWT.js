// generate a JWT token
const jwt = require('jsonwebtoken');

const secret = 'secret' || process.env.JWT_SECRET;

function generateToken(user) {
    const userRole = user.constructor.name;

    const payload = {
      id: userRole === 'customer' ? user.UId : user.SId,
      email: user.email,
      role: userRole,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
}

module.exports = generateToken;