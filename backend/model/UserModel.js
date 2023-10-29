const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, "Email is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    lowercase: true,
    required: true,
    unique: true,
    maxlength: 25,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

/**
 * Static method for user signup
 */

userSchema.statics.signup = async function (email, username, password) {
  // Validation
  if (!email || !username || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Not a valid email");
  }

  const passwordCriteria = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
  };

  if (!validator.isStrongPassword(password, passwordCriteria)) {
    throw Error(
      "The password requires capital and lowercase letters, numbers, and symbols"
    );
  }

  if (username.length > 25) {
    throw Error("Username exceeds the maximum length of 20 characters");
  }

  const alphanumericOptions = {
    ignore: "-._", // Ignore characters "-", ".", and "_"
  };

  if (!validator.isAlphanumeric(username, "en-US", alphanumericOptions)) {
    throw Error("Username must be alphanumeric (allowing '-', '.', and '_')");
  }

  const emailExists = await this.findOne({ email });
  const usernameExists = await this.findOne({ username });
  if (emailExists || usernameExists) {
    throw Error("Email or Username already exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, username, password: hash });

  return user;
};

/**
 * Static method for user login
 */
userSchema.statics.login = async function (email, username, password) {
  // Validation
  const login = email || username;
  if (!login || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw Error("Username or Email is invalid");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid Password");
  }

  return user;
};

module.exports = User;
