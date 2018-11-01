const express = require("express"),
  router = express.Router(),
  handleAsyncError = require("express-async-wrap"),
  scoreHandler = require("../handlers/score_handler"),
  passport = require("passport");

router.post(
  "/new_score",
  passport.authenticate("jwt", { session: false }),
  handleAsyncError(scoreHandler.newScore)
);

router.get("/leaderboard", handleAsyncError(scoreHandler.getLeaderboard));

router.get(
  "/high_score",
  passport.authenticate("jwt", { session: false }),
  handleAsyncError(scoreHandler.getHighScore)
);
module.exports = router;
