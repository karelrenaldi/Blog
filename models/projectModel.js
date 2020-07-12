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
  file: {
    type: String,
    default: "",
  },
  views: {
    type: Number,
    default: 0,
  },
});

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
