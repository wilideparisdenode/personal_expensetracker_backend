const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./model/user'); // Adjust the path as necessary

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:'https://personal-expensetracker-backend-673k.onrender.com/api/auth/google/callback', 
  proxy: true // Needed for HTTPS in production
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in our db
      let existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      
      // If not, create a new user
      const newUser = await new User({
        username: profile.displayName,
        googleId: profile.id
      }).save();
      done(null, newUser);
    } catch (err) {
      done(err, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});   