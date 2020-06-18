const Post = require("../models/postModel");

exports.index = (req, res) => {
  res.render("admin/index");
};

exports.posts = (req, res) => {
  res.send("No post yet");
};

exports.submitPosts = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      status: req.body.status,
      description: req.body.description,
    });
    req.flash("success-message", "Post Created Successfully");
    res.redirect("/admin/posts");
    console.log(newPost);
  } catch (err) {
    // req.flash("success-message", "Post Created Successfully");
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPosts = (req, res) => {
  res.render("admin/create");
};
