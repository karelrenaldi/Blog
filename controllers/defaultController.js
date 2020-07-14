/*eslint-disable */
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const Category = require("../models/categoryModel");
const Newsletter = require("../models/newsletterModel");

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
  const login = req.session.user;
  const allCategory = await getAllCategory();
  allCategory.map( (category, index) => {
    category["index"] = index + 1;
  });
  res.render("default/index", { allCategory: allCategory, login: login });
};

exports.allProjects = async (req, res) => {
  try {
    const login = req.session.user;
    const allCategory = await getAllCategory();
    let { category } = req.query;
    const all = _.isEmpty(category);
    if (all) {
      const dataPost = await Post.find().populate("category").lean();
      const dataClone = _.cloneDeep(dataPost);
      res.render("default/projects", {
        posts: dataClone,
        allCategory: allCategory,
        available: true,
        login: login
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
            category: category,
            allCategory: allCategory,
            available: true,
            login: login
          });
        } else {
          res.render("default/projects", {
            allCategory: allCategory,
            available: false,
            login: login
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
  
  if (!userData) {
    req.flash("failed-message", invalidMessage);
    res.redirect("/login");
  } else {
    const {firstName, lastName} = userData;
    const isMatchPassword = await bcrypt.compare(password, userData.password);

    if (!isMatchPassword) {
      req.flash("failed-message", invalidMessage);
      res.redirect("/login");
    } else {
      const sessionString = randomstring.generate(10);

      await User.findByIdAndUpdate(userData._id, { sessionString }).lean();
      
      req.session.user = {
        id: userData._id,
        sessionString,
      }
      req.flash("success-message", `Welcome Back (${firstName} ${lastName}) !`);
      res.redirect("/");
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
  const login = req.session.user;
  const allCategory = await getAllCategory();
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .lean();
    const views = post.views ? post.views * 1 + 1 : 1;

    await Post.findByIdAndUpdate(id, {
      views,  
    })

    post.description = post.description.replace(/\r?\n/g, '<br />');
    res.render("default/project", { post: post, allCategory: allCategory, views: views, login: login });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if(err) {
      res.redirect("/admin");
    }
    res.clearCookie(process.env.SESS_NAME);
    res.redirect("/");
  })
};

exports.allPosts = async(req, res) => {
  try {
    const login = req.session.user;
    const allCategory = await getAllCategory();
    const dataPost = await Project.find().lean();
    const dataClone = _.cloneDeep(dataPost);
    res.render("default/posts", {
      posts: dataClone,
      allCategory: allCategory,
      login: login,
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
    const login = req.session.user;
    const allCategory = await getAllCategory();
    const { id } = req.params;
    const post = await Project.findById(id)
      .lean();
    const views = post.views ? post.views * 1 + 1 : 1;
  
    await Project.findByIdAndUpdate(id, {
      views: views,  
    })

    post.description = post.description.replace(/\r?\n/g, '<br />');
    res.render("default/post", { post: post, allCategory: allCategory, views: views, login: login });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}

exports.newsletter = async(req, res) => {
  const { email } = req.body;
  const data = await Newsletter.create({
    email,
  });
  
  res.status(200).json({
    status: "success",
    data,
  });
}

exports.contact = async(req, res) => {
  const allCategory = await getAllCategory();
  res.render("default/contact", {allCategory: allCategory});
}