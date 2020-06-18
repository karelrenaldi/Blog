exports.index = (req, res) => {
  res.render("default/index");
};

exports.loginGet = (req, res) => {
  res.render("default/login");
};

exports.loginPost = (req, res) => {
  res.send("Loged in");
};

exports.registerGet = (req, res) => {
  res.render("default/register");
};

exports.registerPost = (req, res) => {
  res.send("Registered");
};
