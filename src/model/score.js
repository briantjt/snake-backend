const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  score: Number,
  username: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model("Score", scoreSchema);
