const passport = require('passport');
const userModal = require('../Model/user.model');
require('dotenv').config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:5000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      userModal.findOne({ googleId: profile.id }, (error, user) => {
        if (error) return cb(error, null);

        if (!user) {
          let newUser = new userModal({
            googleId: profile.id,
            username: profile.displayName,
          });
          newUser.save();
          return cb(null, newUser);
        } else {
          return cb(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const downUser = await User.findById(id);
    done(null, downUser);
  } catch (error) {
    done(error, false);
  }
});
