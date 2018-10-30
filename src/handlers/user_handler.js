const User = require("../model/user");
const status = require("http-status");

async function registerNewUser(req, res) {
  let user = new User();
  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  await user.save();
  return res.json({ user: { username: user.username, email: user.email } });
}

async function login(req, res) {
  const email = req.body.user.email;
  const password = req.body.user.password;
  let user = await User.findOne({ email: email });
  if (!user || !user.validPassword(password)) {
    return res.status(status.UNAUTHORIZED).json({
      error: { message: "email or password is invalid" }
    });
  }

  const token = user.generateJWT();
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: true
  });

  return res.json({
    user: { username: user.username, email: user.email, token: token }
  });
}

async function changePassword(req, res) {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const newUserProfile = req.body.user;
  if (newUserProfile.password) {
    user.setPassword(newUserProfile.password);
  }

  await user.save();
  return res.json({ status: "done" });
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.json({ status: "done" });
}

module.exports = {
  registerNewUser,
  login,
  changePassword,
  logout,
};