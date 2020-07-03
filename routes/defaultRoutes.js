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
  submitComment,
  allProjects,
  allPosts,
  post,
  submitComment2,
} = require("../controllers/defaultController");

const router = express.Router();

const checkLogin = (req, res, next) => {
  if (global.login) {
    res.redirect("/");
  } else {
    next();
  }
};

router.all("/*", (req, res, next) => {
  // Set Layout to admin layout
  req.app.locals.layout = "default";
  next();
});

router.route("/").get(index);
router.route("/allProjets").get(allProjects);
router.route("/login").get(checkLogin, loginGet).post(loginPost);
router.route("/logout").get(logout);
router.route("/register").get(checkLogin, registerGet).post(registerPost);
router.route("/project/:id").get(project).post(submitComment);

router.route("/allPosts").get(allPosts);
router.route("/post/:id").get(post).post(submitComment2);

module.exports = router;
