const express = require("express");
const { isUserAuthenticated } = require("../config/helper");
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
  comment,
  projects,
  createProject,
  submitProject,
  editMenuProject,
  editProject,
  deleteProject,
  comment2,
} = require("../controllers/adminController");

const router = express.Router();

// Middleware To Set Admin Router (/admin)
router.all("/*", isUserAuthenticated, (req, res, next) => {
  // Set Layout to admin layout
  req.app.locals.layout = "admin";
  next();
});

router.route("/").get(index);
router.route("/projects").get(projects);
router.route("/projects/create").get(createProject).post(submitProject);
router.route("/projects/edit/:id").get(editMenuProject).patch(editProject);
router.route("/projects/delete/:id").delete(deleteProject);

router.route("/category").get(categoryMenu).post(createCategory);
router.route("/category/delete/:id").delete(deleteCategory);
router.route("/category/edit/:id").get(editCategoryMenu).patch(editCategory);
router.route("/commentProject").get(comment);

router.route("/posts").get(posts);
router.route("/posts/create").get(createPost).post(submitPost);
router.route("/posts/edit/:id").get(editMenu).patch(editPost);
router.route("/posts/delete/:id").delete(deletePost);
router.route("/commentPost").get(comment2);

module.exports = router;
