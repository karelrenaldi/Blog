exports.index = (req, res) => {
  res.render("default/index");
};

exports.loginGet = (req, res) => {
  res.render("default/login");
};

exports.loginPost = (req, res) => {
  res.send("Loged in");
};
