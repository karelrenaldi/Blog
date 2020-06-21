const bcrypt = require("bcryptjs");
const Post = require("../models/postModel");
const User = require("../models/userModel");
// const { admin } = require("../config/admin");
// const Category = require("../models/categoryModel");

exports.index = async (req, res) => {
  const dataPost = await Post.find().lean();
  res.render("default/index", { posts: dataPost });
};

exports.loginGet = (req, res) => {
  res.render("default/login");
};

exports.loginPost = async (req, res) => {
  // Authetication
  // const { email, password } = req.body;
  // const invalidMessage = "Invalid email or password";
  // const userData = await User.findOne({ email: email }).lean();
  // const dataPost = await Post.find().lean();
  // if (!userData) {
  //   req.flash("failed-message", invalidMessage);
  //   res.redirect("/login");
  // } else {
  //   const isMatchPassword = await bcrypt.compare(password, userData.password);
  //   if (!isMatchPassword) {
  //     req.flash("failed-message", invalidMessage);
  //     res.redirect("/login");
  //   } else {
  //     const isAdmin = admin.includes(userData.email);
  //     if (isAdmin) {
  //       res.login = true;
  //       res.render("default/index", {
  //         posts: dataPost,
  //         login: { isLogin: true },
  //         admin: { isAdmin: true },
  //       });
  //     } else {
  //       res.login = true;
  //       res.render("default/index", {
  //         posts: dataPost,
  //         login: { isLogin: true },
  //       });
  //     }
  //   }
  // }
  res.send("Congratulations, you've successfully submitted the data.");
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

exports.post = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).lean();
    res.render("default/post", { post: post });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
