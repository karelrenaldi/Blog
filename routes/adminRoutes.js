const express = require("express");
const {
  index,
  posts,
  submitPosts,
  createPosts,
} = require("../controllers/adminController");

const router = express.Router();

// Middleware To Set Admin Router (/admin)
router.all("/*", (req, res, next) => {
  // Set Layout to admin layout
  req.app.locals.layout = "admin";
  next();
});

router.route("/").get(index);
router.route("/posts").get(posts);
router.route("/posts/create").get(createPosts).post(submitPosts);

module.exports = router;
