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

exports.isUserAuthenticated = function (req, res, next) {
  console.log(req.session);
  if (req.session.login) {
    next();
  } else {
    res.redirect("/login");
  }
};

exports.time = function (value) {
  return value.toDateString();
};
