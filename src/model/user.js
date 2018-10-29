const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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
  score: [Number]
});

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512").toString("hex");
}

userSchema.methods.setPassword = function(password) {
  this.passwordSalt = generateSalt();
  this.passwordHash = hashPassword(password, this.passwordSalt);
};

userSchema.methods.validPassword = function(password) {
  return this.passwordHash === hashPassword(password, this.passwordSalt)
}

userSchema.plugin(uniqueValidator, { message: "Should be unique" });

module.exports = mongoose.model("User", userSchema);
