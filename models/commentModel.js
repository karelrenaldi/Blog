const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  commentPermission: {
    type: Boolean,
    default: true,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
