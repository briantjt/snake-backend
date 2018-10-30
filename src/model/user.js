const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/jwt");

const validateEmail = email => /\w+@\w+\.\w+/.test(email);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    index: true,
    required: [true, "cannot be blank"],
    unique: true
  },
  email: {
    type: String,
    lowercase: true,
    index: true,
    required: [true, "cannot be blank"],
    unique: true,
    validate: [validateEmail, "Invalid email provided"]
  },
  passwordHash: String,
  passwordSalt: String,
  score: [{score: Number, date: Date}]
});

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
}

userSchema.methods.setPassword = function(password) {
  this.passwordSalt = generateSalt();
  this.passwordHash = hashPassword(password, this.passwordSalt);
};

userSchema.methods.validPassword = function(password) {
  return this.passwordHash === hashPassword(password, this.passwordSalt);
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  const expiry = exp.setDate(today.getDate() + 60) / 1000;
  return jwt.sign(
    {
      userid: this._id,
      username: this.username,
      exp: expiry
    },
    secret
  );
};

userSchema.methods.verifyJWT = function(token) {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};

userSchema.methods.updateScore = function(score) {
  const currentTime = new Date();
  if (this.score.length <= 10) {
    this.score.push({score: score, date: currentTime })
  } else {
    this.score.shift()
    this.score.push({score: score, date: currentTime })
  }
}
userSchema.plugin(uniqueValidator, { message: "Should be unique" });

module.exports = mongoose.model("User", userSchema);
