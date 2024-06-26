const jwt = require('jsonwebtoken');
const Session = require('../models').Session;
const User = require('../models').User;
const Seller = require('../models').Seller;

async function authenticateUser(req, res, next) {
  try {
    
    if (!req.cookies || !req.cookies.jwt) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = req.cookies.jwt;
    let decoded;
    try {
      decoded = jwt.verify(token, 'secret' || process.env.JWT_SECRET); 
      if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // clear the cookie
        res.clearCookie('jwt');
        return res.status(401).json({ message: 'Token expired' });

      }
      return res.status(401).json({ message: 'Unauthorized' });
    }


    // Check if session exists
    const session = await Session.findOne({ where: { jwt: token } });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (new Date(session.expires) < new Date()) {
      await Session.destroy({ where: { userId: decoded.userId } });
      res.clearCookie('jwt');
      return res.status(401).json({ message: 'Session expired' });
    }

    console.log("decoded",decoded)
    const user = decoded.role === 'customer' ? await User.findByPk(decoded.id) : await Seller.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized ...' });
    }

    req.user = user.dataValues;
    req.user.role = decoded.role;

   // console.log("req.body.user",req.body.user)
    next(); 
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = authenticateUser;
