const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User, Seller } = require('../models');

passport.use('user-local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { Email: email } });
      console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.HashedPassword);
      // console.log(password, await bcrypt.hash(password, 10),  user.HashedPassword, isPasswordValid)
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.use('seller-local', new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const seller = await Seller.findOne({ where: { Email: email } });
      console.log(email, password, seller);

      if (!seller) {
        return done(null, false, { message: 'Incorrect email' });
      }
      const isPasswordValid = await bcrypt.compare(password, seller.HashedPassword);
      // console.log(password, await bcrypt.hash(password, 10),  seller.HashedPassword, isPasswordValid)

      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, seller);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, { id: user.id, model: user.constructor.name });
});

passport.deserializeUser(async (serialized, done) => {
  try {
    let user = null;
    if (serialized.model === 'User') {
      user = await User.findByPk(serialized.id);
    } else if (serialized.model === 'Seller') {
      user = await Seller.findByPk(serialized.id);
    }
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
