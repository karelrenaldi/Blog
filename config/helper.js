exports.selectOption = function (status, options) {
  return options
    .fn(this)
    .replace(new RegExp(`value="${status}"`), '$&selected="selected"');
};

exports.preview = function (value) {
  if (value.length > 100) return `${value.slice(0, 120)}...`;
  return `${value} ...`;
};

exports.isUserAuthenticated = function (req, res, next) {
  if (global.admin) {
    next();
  } else if (global.login) {
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
  // if (req.isAuthenticated()) {
  //   next();
  // } else {
  //   res.redirect("/login");
  // }
};
