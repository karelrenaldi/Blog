const Post = require("../models/postModel");
// const Category = require("../models/categoryModel");

exports.index = async (req, res) => {
  const dataPost = await Post.find().lean();
  res.render("default/index", { posts: dataPost });
};

exports.loginGet = (req, res) => {
  res.render("default/login");
};

exports.loginPost = (req, res) => {
  res.send("Loged in");
};

exports.registerGet = (req, res) => {
  res.render("default/register");
};

exports.registerPost = (req, res) => {
  res.send("Registered");
};
