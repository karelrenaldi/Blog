const express = require("express");
const {
  index,
  loginGet,
  loginPost,
  registerGet,
  registerPost,
} = require("../controllers/defaultController");

const router = express.Router();

router.all("/*", (req, res, next) => {
  // Set Layout to admin layout
  req.app.locals.layout = "default";
  next();
});

router.route("/").get(index);
router.route("/login").get(loginGet).post(loginPost);
router.route("/register").get(registerGet).post(registerPost);

module.exports = router;
