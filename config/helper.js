exports.selectOption = function (status, options) {
  return options
    .fn(this)
    .replace(new RegExp(`value="${status}"`), '$&selected="selected"');
};

exports.isUserAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};
