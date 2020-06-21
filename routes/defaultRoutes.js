const express = require("express");
const passport = require("passport");
const {
  index,
  loginGet,
  loginPost,
  registerGet,
  registerPost,
  post,
} = require("../controllers/defaultController");

const router = express.Router();

router.all("/*", (req, res, next) => {
  // Set Layout to admin layout
  req.app.locals.layout = "default";
  next();
});

router.route("/").get(index);
// Defining Local Strategy
router
  .route("/login")
  .get(loginGet)
  .post(
    passport.authenticate("local", {
      successRedirect: "/admin",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: true,
      session: true,
    }),
    loginPost
  );
router.route("/register").get(registerGet).post(registerPost);
router.route("/post/:id").get(post);

module.exports = router;
