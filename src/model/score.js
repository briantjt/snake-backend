const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  score: Number,
  user: { type: mongoose.Schema.Types.ObjectId, required: true }
});

ScoreSchema.index({ score: -1, user: 1 }, { unique: true });
module.exports = mongoose.model("Score", ScoreSchema);
