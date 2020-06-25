/*eslint-disable */
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
// const { admin } = require("../config/admin");
// const Category = require("../models/categoryModel");

exports.index = (req, res) => {
  const { admin, login } = global;
  res.render("default/index", { admin: admin, login: login });
};

exports.allProjects = async (req, res) => {
  try {
    let { category } = req.query;
    const { admin, login } = global;
    const all = _.isEmpty(category);
    if (all) {
      const dataPost = await Post.find().populate("category").lean();
      const dataClone = _.cloneDeep(dataPost);
      res.render("default/posts", {
        posts: dataClone,
        admin: admin,
        login: login,
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
          res.render("default/posts", {
            posts: dataFilter,
            admin: admin,
            login: login,
            category: category,
          });
        } else {
          res.send("NOT FOUND");
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

exports.loginGet = (req, res) => {
  res.render("default/login");
};

exports.loginPost = async (req, res) => {
  // Authetication
  const { email, password } = req.body;
  const invalidMessage = "Invalid email or password";
  const userData = await User.findOne({ email: email }).lean();
  const dataPost = await Post.find().lean();
  const admin = ["karelrenaldi8@gmail.com"];
  if (!userData) {
    global.login = false;
    global.admin = false;
    // req.flash("failed-message", invalidMessage);
    // res.send("Tidak terdaftar");
    res.redirect("/login");
    // console.log(res.locals.login);
  } else {
    const isMatchPassword = await bcrypt.compare(password, userData.password);
    if (!isMatchPassword) {
      global.login = false;
      global.admin = false;
      // req.flash("failed-message", invalidMessage);
      res.redirect("/login");
      // res.send("Password Salah");
    } else {
      const isAdmin = admin.includes(userData.email);
      if (isAdmin) {
        global.login = true;
        global.admin = true;
        global.id = userData._id;
        res.redirect("/");
        // res.render("default/index", {
        //   posts: dataPost,
        //   login: { isLogin: true },
        //   admin: { isAdmin: true },
        // });
      } else {
        global.login = true;
        global.admin = false;
        global.id = userData._id;
        res.redirect("/");
        // res.send(res.locals.login);
        // res.render("default/index", {
        //   posts: dataPost,
        //   login: { isLogin: true },
        // });
      }
    }
  }
  // res.send("Congratulations, you've successfully submitted the data.");
};

exports.registerGet = (req, res) => {
  res.render("default/register");
};

exports.registerPost = async (req, res) => {
  try {
    // TODO MAKE MODAL TO ALERT SOME ERROR
    // TODO USE BCRYPT ENCRYPTION
    // TODO MAKE MORE COMPLEX PASSWORD CONFIRMATION
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
  try {
    const { admin, login } = global;
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate({ path: "comments", populate: { path: "user", model: "User" } })
      .lean();
    // console.log(post.description);
    res.render("default/post", { post: post, admin: admin, login: login });
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
  //todo
  // req.logOut();
  // req.flash("success-message", "Logout was succesful");
  res.redirect("/");
};

// exports.submitComment = async (req, res) => {
//   try {
//     // Check user has been login or not
//     if (req.user) {
//       const { id } = req.body;
//       const post = await Post.findById(id).lean();
//       const newComment = new Comment({
//         user: req.user.id,
//         body: req.body.comment_body,
//       });
//       await Post.findByIdAndUpdate(
//         id,
//         {
//           comments: post.comments.push(newComment),
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       ).lean();
//       await Comment.create({
//         user: req.user.id,
//         body: req.body.comment_body,
//       }).lean();
//       res.redirect(`/post/${post._id}`);
//     } else {
//       req.flash("failed-message", "Login first to comment");
//       res.redirect("/login");
//     }
//   } catch (err) {
//     res.send(err);
//   }
// };

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
