const mongoose = require("mongoose");

const Comment2Schema = new mongoose.Schema({
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

const Comment2 = mongoose.model("Comment2", Comment2Schema);
module.exports = Comment2;
