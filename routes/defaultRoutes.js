const express = require("express");
// todo
// const passport = require("passport");
const {
  index,
  loginGet,
  loginPost,
  registerGet,
  registerPost,
  project,
  logout,
  allProjects,
  allPosts,
  post,
  newsletter,
  contact,
} = require("../controllers/defaultController");

const router = express.Router();

const checkLogin = (req, res, next) => {
  if (req.session.login) {
    res.redirect("/");
  } else {
    next();
  }
};

const canLogout = (req, res, next) => {
  if (req.session.login) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.all("/*", (req, res, next) => {
  console.log(req.session);
  req.app.locals.layout = "default";
  next();
});

router.route("/").get(index).post(newsletter);
router.route("/allProjects").get(allProjects);
router.route("/login").get(checkLogin, loginGet).post(loginPost);
router.route("/logout").get(canLogout, logout);
router.route("/register").get(checkLogin, registerGet).post(registerPost);
router.route("/project/:id").get(project);

router.route("/allPosts").get(allPosts);
router.route("/post/:id").get(post);

router.route("/contact").get(contact);

module.exports = router;
