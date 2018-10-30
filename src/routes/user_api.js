const express = require("express"),
  router = express.Router(),
  handleAsyncError = require("express-async-wrap"),
  userHandler = require("../handler/user_handler"),
  passport = require("passport");

router.post("/signup", handleAsyncError(userHandler.registerNewUser));
router.post("/login", handleAsyncError(userHandler.login));
router.put(
  "/change_password",
  passport.authenticate("jwt", { session: false }),
  handleAsyncError(userHandler.changePassword)
);
router.post("/logout", handleAsyncError(userHandler.logout))

module.exports = router