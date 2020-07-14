const User = require("../models/userModel");

const month = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DES",
];

exports.selectOption = function (status, options) {
  return options
    .fn(this)
    .replace(new RegExp(`value="${status}"`), '$&selected="selected"');
};

exports.preview = function (value) {
  if (value.length > 100) return `${value.slice(0, 120)}...`;
  return `${value} ...`;
};

exports.getDate = function (value) {
  return value.getDate();
};

exports.getMonth = function (value) {
  return month[value.getMonth()];
};

exports.isUserAuthenticated = async function (req, res, next) {
  const { user } = req.session;
  if (user) {
    const { sessionString } = await User.findById(user.id);
    if (user.sessionString === sessionString) {
      next();
    } else {
      req.session.destroy((err) => {
        if (err) {
          res.redirect("/admin");
        }
        res.clearCookie(process.env.SESS_NAME);
        res.redirect("/login");
      });
    }
  } else {
    res.redirect("/login");
  }
};

exports.time = function (value) {
  return value.toDateString();
};
