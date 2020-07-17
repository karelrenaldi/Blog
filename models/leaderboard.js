const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nominal: {
    type: Number,
    required: true,
  },
  proker: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: new Date(),
  },
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = Leaderboard;
