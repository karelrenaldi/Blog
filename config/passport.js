const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/userModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        // Match user
        User.findOne({
          email: email,
        }).then((user) => {
          if (!user) {
            return done(
              null,
              false,
              req.flash("failed-message", "That email is not registered")
            );
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(
                null,
                user,
                req.flash("success-message", "Login Successful")
              );
            }
            return done(
              null,
              false,
              req.flash("failed-message", "Password Incorect")
            );
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
