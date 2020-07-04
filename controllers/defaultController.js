/*eslint-disable */
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const Project = require("../models/projectModel");
const Comment2 = require("../models/comment2Model");
const Category = require("../models/categoryModel");

const getAllCategory = async function(){
  let allCategory = await Category.find().lean();
  allCategory = allCategory.map( category => {
    category.title.includes(" & ")
      ? category.query = category.title.replace(" & ","-")
      : category.query = category.title;
    return category;
  })
  return allCategory
}

exports.index = async(req, res) => {
  const allCategory = await getAllCategory();
  allCategory.map( (category, index) => {
    category["index"] = index + 1;
  });
  const { admin, login } = global;
  res.render("default/index", { admin: admin, login: login, allCategory: allCategory });
};

exports.allProjects = async (req, res) => {
  try {
    const allCategory = await getAllCategory();
    let { category } = req.query;
    const { admin, login } = global;
    const all = _.isEmpty(category);
    if (all) {
      const dataPost = await Post.find().populate("category").lean();
      const dataClone = _.cloneDeep(dataPost);
      res.render("default/projects", {
        posts: dataClone,
        admin: admin,
        login: login,
        allCategory: allCategory,
        available: true,
      });
    } else {
      category = category.includes("-")
        ? category.replace("-", " & ")
        : category;
      if (category) {
        const data = await Post.find().populate("category").lean();
        const dataFilter = data.filter((dataObj) => {
          return dataObj.category.title === category;
        });
        if (dataFilter.length > 0) {
          res.render("default/projects", {
            posts: dataFilter,
            admin: admin,
            login: login,
            category: category,
            allCategory: allCategory,
            available: true,
          });
        } else {
          res.render("default/projects", {
            allCategory: allCategory,
            available: false,
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.loginGet = async (req, res) => {
  const allCategory = await getAllCategory();
  res.render("default/login", { allCategory: allCategory });
};

exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const invalidMessage = "Invalid email or password";
  const userData = await User.findOne({ email: email }).lean();
  const admin = ["karelrenaldi8@gmail.com", "kmitb@itb.com"];
  if (!userData) {
    global.login = false;
    global.admin = false;
    req.flash("failed-message", invalidMessage);
    res.redirect("/login");
  } else {
    const {firstName, lastName} = userData;
    const isMatchPassword = await bcrypt.compare(password, userData.password);
    if (!isMatchPassword) {
      global.login = false;
      global.admin = false;
      req.flash("failed-message", invalidMessage);
      res.redirect("/login");
    } else {
      const isAdmin = admin.includes(userData.email);
      if (isAdmin) {
        global.login = true;
        global.admin = true;
        global.id = userData._id;
        req.flash("success-message", `Welcome Back Admin (${firstName} ${lastName}) !`);
        res.redirect("/");
      } else {
        global.login = true;
        global.admin = false;
        global.id = userData._id;
        req.flash("success-message", `Welcome Back (${firstName} ${lastName}) !`);
        res.redirect("/");
      }
    }
  }
};

exports.registerGet = async (req, res) => {
  const allCategory = await getAllCategory();
  res.render("default/register", { allCategory: allCategory });
};

exports.registerPost = async (req, res) => {
  try {
    // TODO MAKE MODAL TO ALERT SOME ERROR
    const errors = [];
    const { password, passwordConfirm, firstName, lastName, email } = req.body;
    // Password confirmation
    if (password !== passwordConfirm)
      errors.push({ message: "Password not match" });
    if (errors.length > 0) {
      res.render("default/register", {
        errors: errors,
        firstName: firstName,
        lastName: lastName,
        email: email,
      });
    } else {
      const registered = await User.findOne({ email: email });
      if (registered) {
        req.flash("failed-message", "Email already exist try to login");
        res.redirect("/login");
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashPassword,
        });
        req.flash("success-message", "You Are Now Registered");
        res.redirect("/login");
      }
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.project = async (req, res) => {
  const allCategory = await getAllCategory();
  try {
    const { admin, login } = global;
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate({ path: "comments", populate: { path: "user", model: "User" } })
      .lean();
    post.description = post.description.replace(/\r?\n/g, '<br />');
    res.render("default/project", { post: post, admin: admin, login: login , allCategory: allCategory });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.logout = (req, res) => {
  global.login = false;
  global.admin = false;
  global.id = null;
  req.flash("success-message", "LOGGED OUT");
  res.redirect("/");
};

exports.submitComment = (req, res) => {
  const { id, comment_body } = req.body;
  if (global.login) {
    Post.findById(id).then((post) => {
      const newComment = new Comment({
        user: global.id,
        body: comment_body,
      });
      post.comments.push(newComment);
      post.save().then(() => {
        newComment.save().then(() => {
          req.flash(
            "success-message",
            "Your comment was submitted for review."
          );
          res.redirect(`/project/${post._id}`);
        });
      });
    });
  } else {
    req.flash("failed-message", "Login first to comment");
    res.redirect("/login");
  }
};

exports.allPosts = async(req, res) => {
  try {
    const allCategory = await getAllCategory();
    const { admin, login } = global;
      const dataPost = await Project.find().lean();
      const dataClone = _.cloneDeep(dataPost);
      res.render("default/posts", {
        posts: dataClone,
        admin: admin,
        login: login,
        allCategory: allCategory,
      });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}


exports.post = async(req, res) => {
  try {
    const allCategory = await getAllCategory();
    const { admin, login } = global;
    const { id } = req.params;
    const post = await Project.findById(id)
      .populate({ path: "comments", populate: { path: "user", model: "User" } })
      .lean();
    post.description = post.description.replace(/\r?\n/g, '<br />');
    res.render("default/post", { post: post, admin: admin, login: login, allCategory: allCategory });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}
exports.submitComment2 = async(req, res) => {
  const { id, comment_body } = req.body;
  if (global.login) {
    Project.findById(id).then((post) => {
      const newComment = new Comment2({
        user: global.id,
        body: comment_body,
      });
      post.comments.push(newComment);
      post.save().then(() => {
        newComment.save().then(() => {
          req.flash(
            "success-message",
            "Your comment was submitted for review."
          );
          res.redirect(`/post/${post._id}`);
        });
      });
    });
  } else {
    req.flash("failed-message", "Login first to comment");
    res.redirect("/login");
  }
}