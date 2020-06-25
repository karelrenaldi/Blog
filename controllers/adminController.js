const Post = require("../models/postModel");
const Category = require("../models/categoryModel");
const Comment = require("../models/commentModel");

exports.index = (req, res) => {
  res.render("admin/index");
};

exports.posts = async (req, res) => {
  try {
    const posts = await Post.find().populate("category").lean();
    res.render("admin/posts", { posts: posts });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.submitPost = async (req, res) => {
  try {
    // TODO Make Image Upload
    const texts = req.body.description.split("\r\n");
    const newTexts = texts
      .map((text) => {
        if (text.length === 0) {
          return "<br /><br />";
        }
        return text;
      })
      .join("\n");
    const allow = !!req.body.allowComments;
    let filename = "";
    if (req.files) {
      const file = req.files.fileUpload;
      filename = file.name;
      file.mv(`./public/uploads/${filename}`, (err) => {
        if (err) res.send(err);
      });
    }

    if (filename === "") {
      await Post.create({
        title: req.body.title,
        status: req.body.status,
        description: newTexts,
        allowComment: allow,
        category: req.body.category,
      });
    } else {
      await Post.create({
        title: req.body.title,
        status: req.body.status,
        description: newTexts,
        allowComment: allow,
        category: req.body.category,
        file: `/uploads/${filename}`,
      });
    }
    req.flash("success-message", "Post Created Successfully");
    res.redirect("/admin/posts");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPost = async (req, res) => {
  const data = await Category.find().lean();
  res.render("admin/create", { categories: data });
};

exports.editMenu = async (req, res) => {
  const { id } = req.params;
  const dataCategory = await Category.find().lean();
  const dataPost = await Post.findById(id).populate("category").lean();
  res.render("admin/edit", { post: dataPost, categories: dataCategory });
};

exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const allow = !!req.body.allowComments;
    await Post.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
        allowComment: allow,
        category: req.body.category,
      },
      {
        new: true,
        runValidators: true, // Make sure the req.body have same schema
      }
    );
    req.flash("success-message", "Post Edited Successfully");
    res.redirect("/admin/posts");
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success-message", "Post Deleted Successfully");
    res.redirect("/admin/posts");
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.categoryMenu = async (req, res) => {
  try {
    const data = await Category.find().lean();
    res.render("admin/category", { categories: data });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const data = await Category.create({
      title: req.body.title,
    });
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.editCategoryMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const dataCategory = await Category.find().lean();
    const dataCategoryId = await Category.findById(id).lean();
    res.render("admin/category-edit", {
      categories: dataCategory,
      category: dataCategoryId,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.redirect("/admin/category");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.redirect("/admin/category");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.comment = async (req, res) => {
  const comments = await Comment.find().populate("user").lean();
  res.render("admin/comments", { comments: comments });
};
