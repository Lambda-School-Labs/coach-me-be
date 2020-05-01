const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/client-model");
const bcrypt = require("bcrypt");
function localLogin(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await User.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (passwordMatches) {
          return done(null, user);
        }

        return done(null, false, { message: "Your password is incorrect!" });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.getUserById(id);
    done(null, user);
  });
}

module.exports = localLogin;
