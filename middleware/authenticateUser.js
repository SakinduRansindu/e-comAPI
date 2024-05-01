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
    const decoded = jwt.verify(token, 'secret' || process.env.JWT_SECRET); 

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
    const user = decoded.role === 'User' ? await User.findByPk(decoded.id) : await Seller.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized ...' });
    }

    req.body.user = user.dataValues;
    req.body.user.role = decoded.role;

    next(); 
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = authenticateUser;
