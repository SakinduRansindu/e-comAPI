const bcrypt = require('bcrypt');
const passport = require('../utils/passport');
const generateJWT  = require('../utils/generateJWT');


var User = require('../models').User;
var Seller = require('../models').Seller;
var Session = require('../models').Session;

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

    // create session
    // await Session.create({
    //   uname: newUser.uname,
    //   jwt: generateJWT(newUser),
    //   role: 'user',
    //   expireDate: new Date(Date.now() + 3600000), // exp in 1 hour
    // });

    res.status(201).json({ message: 'User registered successfully', user: newUser }).cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' });
  } catch (error) {
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

    const HashedPassword = await bcrypt.hash(Password, 10);

    const newSeller = await Seller.create({
      DisplayName,
      Email,
      HashedPassword,
      Bank_Acc_No,
      Phone_No,
      ProfilePicture,
    });

    // create a new session
    // await Session.create({
    //   uname: newSeller.uname,
    //   jwt: generateJWT(newSeller),
    //   role: 'seller',
    //   expireDate: new Date(Date.now() + 3600000), // exp in 1 hour
    // });



    res.status(201).json({ message: 'Seller registered successfully', seller: newSeller }).cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' });
  } catch (error) {
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
    let userType = 'user';
    console.log(user);
    if (!user) {
      // check if the seller exists
        seller = await Seller.findOne({ where: { Email: email } });
        userType = 'seller';
        if (!seller) {
            console.log('Not even seller?');

            return res.status(401).json({ message: 'Invalid email or password' });
        }

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const hashedPassword = userType === 'user' ? user.HashedPassword : seller.HashedPassword;


    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
        userInfo = user || seller;
        const token = generateJWT(userInfo);
        // await Session.create({
        //   uname: userType === 'user' ? user.uname : seller.uname,
        //   jwt: token,
        //   role: userType,
        //   expireDate: new Date(Date.now() + 3600000), // exp in 1 hour
        // });

        return res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' }).json({ message: 'Login successful', user: {
            uname: userInfo.uname,
            FirstName: userInfo.FirstName,
            LastName: userInfo.LastName,
            Email: userInfo.Email,
            Type: userType,
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


//   function login(req, res) {
 
    // passport.authenticate(['user-local', 'seller-local'], { session: false }, (err, user, info) => {
    //   if (err || !user) {
        
    //     return res.status(401).json({ message: 'Invalid email or password' });
    //   }
  
    //   req.login(user, { session: false }, async (err) => {
    //     if (err) {
    //       return res.status(500).json({ message: 'Internal server error' });
    //     }
  
    //     try {
    //       const token = generateJWT(user);
    //       await Session.create({
    //         uname: user.uname,
    //         jwt: token,
    //         role: user.constructor.name === 'User' ? 'user' : 'seller',
    //         expireDate: new Date(Date.now() + 3600000), // exp in 1 hour
    //       });
  
    //       return res.json({ user }).cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none' });
    //     } catch (error) {
    //       console.error('Error generating JWT or creating session:', error);
    //       return res.status(500).json({ message: 'Internal server error' });
    //     }
    //   });
    // })(req, res, next);
//   }
  


async function logout(req, res) {
    // find the user session and delete it
    await Session.destroy({ where: { uname: req.user.uname } });

    res.clearCookie('jwt');


    res.json({ message: 'Logged out successfully' });
  }

  

module.exports = { registerUser, registerSeller, login };