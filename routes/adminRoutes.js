const express = require("express");
const {
  index,
  posts,
  submitPost,
  createPost,
  editMenu,
  editPost,
  deletePost,
  categoryMenu,
  createCategory,
  editCategoryMenu,
  editCategory,
  deleteCategory,
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
router.route("/posts/create").get(createPost).post(submitPost);
router.route("/posts/edit/:id").get(editMenu).patch(editPost);
router.route("/posts/delete/:id").delete(deletePost);
router.route("/category").get(categoryMenu).post(createCategory);
router.route("/category/delete/:id").delete(deleteCategory);
router.route("/category/edit/:id").get(editCategoryMenu).patch(editCategory);

module.exports = router;
