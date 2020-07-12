const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
  },
  description: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  file: {
    type: String,
    default: "",
  },
  pdf: {
    type: String,
    default: "",
  },
  views: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
