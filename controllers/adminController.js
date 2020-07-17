const Post = require("../models/postModel");
const Category = require("../models/categoryModel");
const Project = require("../models/projectModel");
const Newsletter = require("../models/newsletterModel");
const Leaderboard = require("../models/leaderboard");

exports.index = async (req, res) => {
  // get total view from project
  let totalViewProject = await Post.aggregate([
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);
  totalViewProject = totalViewProject[0].totalViews;
  // get total view from post
  let totalViewsPost = await Project.aggregate([
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  totalViewsPost = totalViewsPost[0].totalViews;

  res.render("admin/index", {
    viewProject: totalViewProject,
    viewPost: totalViewsPost,
  });
};

exports.projects = async (req, res) => {
  try {
    const data = await Post.find().populate("category").lean();
    res.render("admin/projects", { posts: data });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.submitProject = async (req, res) => {
  try {
    const texts = req.body.description;
    const now = new Date().getTime();
    let pdfFileName = "";
    let imageFileName = "";

    if (req.files) {
      const fileImage = req.files.imageUpload;
      const filePdf = req.files.pdfUpload;

      imageFileName = fileImage.name;
      pdfFileName = filePdf.name;

      fileImage.mv(`./public/uploads/${now}-${imageFileName}`, (err) => {
        if (err) return res.send(err);
      });
      filePdf.mv(`./public/pdf/${now}-${pdfFileName}`, (err) => {
        if (err) return res.send(err);
      });
    }

    await Post.create({
      title: req.body.title,
      status: req.body.status,
      description: texts,
      category: req.body.category,
      file: imageFileName === "" ? "" : `/uploads/${now}-${imageFileName}`,
      pdf: pdfFileName === "" ? "" : `/pdf/${now}-${pdfFileName}`,
    });

    req.flash("success-message", "Project Created Successfully");
    res.redirect("/admin/projects");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createProject = async (req, res) => {
  const data = await Category.find().lean();
  res.render("admin/create", { categories: data });
};

exports.editMenuProject = async (req, res) => {
  const { id } = req.params;
  const dataCategory = await Category.find().lean();
  const dataPost = await Post.findById(id).populate("category").lean();
  res.render("admin/edit", { post: dataPost, categories: dataCategory });
};

exports.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
        category: req.body.category,
      },
      {
        new: true,
        runValidators: true, // Make sure the req.body have same schema
      }
    );
    req.flash("success-message", "Projects Edited Successfully");
    res.redirect("/admin/projects");
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success-message", "Projects Deleted Successfully");
    res.redirect("/admin/projects");
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

//============POST=================

exports.posts = async (req, res) => {
  try {
    const data = await Project.find().lean();
    res.render("admin/posts", { posts: data });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.submitPost = async (req, res) => {
  try {
    const texts = req.body.description;
    let filename = "";
    if (req.files) {
      const file = req.files.fileUpload;
      filename = file.name;
      file.mv(`./public/uploads/${filename}`, (err) => {
        if (err) res.send(err);
      });
    }

    if (filename === "") {
      await Project.create({
        title: req.body.title,
        status: req.body.status,
        description: texts,
        category: req.body.category,
      });
    } else {
      await Project.create({
        title: req.body.title,
        status: req.body.status,
        description: texts,
        category: req.body.category,
        file: `/uploads/${filename}`,
      });
    }
    req.flash("success-message", "Posts Created Successfully");
    res.redirect("/admin/posts");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPost = async (req, res) => {
  res.render("admin/createPost");
};

exports.editMenu = async (req, res) => {
  const { id } = req.params;
  const dataPost = await Project.findById(id).populate("category").lean();
  res.render("admin/editPost", { post: dataPost });
};

exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
      },
      {
        new: true,
        runValidators: true, // Make sure the req.body have same schema
      }
    );
    req.flash("success-message", "Posts Edited Successfully");
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
    await Project.findByIdAndDelete(id);
    req.flash("success-message", "Posts Deleted Successfully");
    res.redirect("/admin/posts");
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.newsletter = async (req, res) => {
  try {
    const emails = await Newsletter.find().lean();
    res.render("admin/newsletter", { emails: emails });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.newsletterData = async (req, res) => {
  try {
    const emails = await Newsletter.find().lean();
    res.status(200).json({
      emails,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.leaderboardForm = async (req, res) => {
  try {
    const projects = await Post.find().lean();
    res.render("admin/leaderboard", { projects });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.leaderboardSubmit = async (req, res) => {
  try {
    const { name, nominal, proker } = req.body;

    await Leaderboard.create({
      name,
      nominal: nominal * 1,
      proker,
    });
    res.redirect("/admin");
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
