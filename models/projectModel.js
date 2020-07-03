const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
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
  // Every Post have comment more than 1
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment2",
    },
  ],
  allowComment: {
    type: Boolean,
    default: false,
  },
  file: {
    type: String,
    default: "",
  },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
