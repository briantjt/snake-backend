const Score = require("../model/score");

async function scoreHandler(req, res) {
  let newScore = new Score({ score: req.body.score, user: req.user._id });
  await newScore.save()
  return res.json({ status: "score saved" });
}
