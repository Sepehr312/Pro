const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Users = require("../models/users");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: ".نام کاربری یا کلمه عبور صحیح نیست",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: ".نام کاربری یا کلمه عبور صحیح نیست",
          });
        }
        const userData = {
          id: user._id,
          firstName: user.firstName,
          role: user.role,
        };
        return done(null, userData);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    
    const user = await Users.findById(id);
    const userData = {
        id: user._id,
        firstName: user.firstName,
        role: user.role,
      };
    done(null, userData);
  } catch (err) {
    done(err, null);
  }
});
