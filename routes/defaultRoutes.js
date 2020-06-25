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
// Defining Local Strategy
router.route("/login").get(checkLogin, loginGet).post(
  //todo
  // passport.authenticate("local", {
  //   successRedirect: "/admin",
  //   failureRedirect: "/login",
  //   failureFlash: true,
  //   successFlash: true,
  //   session: true,
  // }),
  loginPost
);
router.route("/logout").get(logout);
router.route("/register").get(registerGet).post(registerPost);
router.route("/project/:id").get(project).post(submitComment);

module.exports = router;
