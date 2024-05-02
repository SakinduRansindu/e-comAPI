const bcrypt = require('bcrypt');
const generateJWT  = require('../utils/generateJWT');



var User = require('../models').User;
var Seller = require('../models').Seller;
var Session = require('../models').Session;
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
  const { uname, FirstName, LastName, Email, Password, Account_No, Card_CVC, Card_Exp, Phone_No, ProfilePicture } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // check if the user has registered as a seller
    const existingSeller = await Seller.findOne({ where: { Email } });
    if (existingSeller) {
        return res.status(400).json({ message: 'User already exists as a seller' });
    }

    // check if uname is already taken by a seller
    const existingSellerUname = await Seller.findOne({ where: { uname } });
    if (existingSellerUname) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    // check passowrd complexity
    if (Password.length < 10) {
        return res.status(400).json({ message: 'Password must be at least 10 characters long' });
    }

    const HashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await User.create({
      uname,
      FirstName,
      LastName,
      Email,
      HashedPassword,
      Account_No,
      Card_CVC,
      Card_Exp,
      Phone_No,
      ProfilePicture,
    });

    const token = generateJWT(newUser);

    // create session
    await Session.create({
        userId: newUser.UId,
        role: 'customer',
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        jwt: token
    }); 

    res.status(201)
    .cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' })
    .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error during user registration:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
}

async function registerSeller(req, res) {
  const { DisplayName, Email, Password, Bank_Acc_No, Phone_No, ProfilePicture } = req.body;

  try {
    // check if the seller already exists
    const existingSeller = await Seller.findOne({ where: { Email } });

    if (existingSeller) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    // check if the seller has registered as a user
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Seller already exists as a user' });
    }

    // check passowrd complexity
    if (Password.length < 10) {
        return res.status(400).json({ message: 'Password must be at least 10 characters long' });
    }
    const HashedPassword = await bcrypt.hash(Password, 10);

    const newSeller = await Seller.create({
      DisplayName,
      Email,
      HashedPassword,
      Bank_Acc_No,
      Phone_No,
      ProfilePicture,
    });

    const token = generateJWT(newSeller);

    // create session
    await Session.create({
        userId: newSeller.UId,
        role: 'seller',
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        jwt: token
    }); 

    res.status(201)
    .cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' })
    .json({ message: 'Seller registered successfully', seller: newSeller });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors[0].message });
    }

    console.error('Error during seller registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function login(req, res) {
    // manually authenticate the user without using passport
    const { email, password } = req.body;
    
    try {
    // check if the user exists
    const user = await User.findOne({ where: { Email: email } });
    let seller = null;
    let userType = 'customer';

    if (!user) {
      // check if the seller exists
        seller = await Seller.findOne({ where: { Email: email } });
        userType = 'seller';
        console.log("Menna seller",seller)
        if (!seller) {
            return res.status(401).json({ message: 'Invalid email or password' });
        } 
    }
    
    const hashedPassword = userType === 'customer' ? user.HashedPassword : seller.HashedPassword;


    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
        userInfo = user || seller;
        id = user ? user.UId : seller.SId;
        const token = generateJWT(userInfo);
        // if there is an existing session, delete it
        await Session.destroy({ where: { userId: id } });

        // create session
        await Session.create({
            userId: id,
            role: userType,
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            jwt: token
        }); 
        console.log(userInfo);
        return res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' }).status(200).json({ message: 'Login successful', user: {
            uname: userInfo.uname,
            FirstName: userInfo.FirstName||userInfo.DisplayName,
            LastName: userInfo.LastName,
            Email: userInfo.Email,
            Type: userType,
            ProfilePicture: userInfo.ProfilePicture,
        } });

      } catch (error) {
        console.error('Error generating JWT or creating session:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
   
  }
  

async function logout(req, res) {
    // check if user has a cookie that contains the jwt

    console.log(req.cookies)
    if (!req.cookies || !req.cookies.jwt) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // there is a field called jwt in sessiom table
    // so just check if the jwt string is in the session table
    // and delete
    const token = req.cookies.jwt;
    const decoded = jwt.decode(token);
    const user = decoded.role === 'customer' ? await User.findByPk(decoded.id) : await Seller.findByPk(decoded.id);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // find the user session and delete it
    await Session.destroy({ where: { userId: decoded.id } });

    res.clearCookie('jwt');

    res.json({ message: 'Logged out successfully' });
}
  

module.exports = { registerUser, registerSeller, login, logout};