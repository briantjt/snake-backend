const Score = require("../model/score");

async function newScore(req, res) {
  let newScore = new Score({ score: req.body.score, user: req.user._id });
  let score = await newScore.save();
  return res.json(score);
}

async function getLeaderboard(req, res) {
  let top10 = await Score.find({}).populate('user', 'username')
    .limit(10)
    .sort({ score: -1 });
  res.json(top10);
}

async function getHighScore(req, res) {
  let highScore = await Score.findOne({user: req.user._id}).sort({score: -1})
  res.json(highScore)
}
module.exports = { newScore, getLeaderboard, getHighScore };
