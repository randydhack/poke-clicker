const express = require("express");
const router = express.Router();
const User = require("../../model/UserModel");

const bcrypt = require('bcrypt')
const validator = require("validator");


// Get current User
router.get("/", async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  return res.status(200).json(user);
});


// Signup Route Validation
router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  // Validation
  if (!email || !username || !password) {
    return res.json("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    return res.json("Not a valid email");
  }

  const passwordCriteria = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false,
  };

  const errors = {
  }

  if (!validator.isStrongPassword(password, passwordCriteria)) {
    errors['password'] =
      "The password requires capital and lowercase letters, numbers, and symbols"
  }

  if (username.length > 25) {
    errors['usernameLength'] = "Username exceeds the maximum length of 20 characters"
  }

  const alphanumericOptions = {
    ignore: "-._", // Ignore characters "-", ".", and "_"
  };

  if (!validator.isAlphanumeric(username, "en-US", alphanumericOptions)) {
    errors['username'] = "Username must be alphanumeric (allowing '-', '.', and '_')"


  }

  const usernameExists = await User.findOne({username});
  const emailExists = await User.findOne({email});
  if (emailExists || usernameExists) {
    errors['exist'] = "Email or Username already exist"
  }

  if (Object.values(errors).length) {
    return res.status(400).json(errors)
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({ email, username, password: hash });
  return res.status(200).json(user)
});

// Login Route Validation
router.post('/login', async (req, res) => {
    // Validation
    const {email, username, password} = req.body
  const login = email || username;
  if (!login || !password) {
    return res.json("All fields must be filled");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.json("Username or Email is invalid");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json("Invalid Password");
  }

  return res.status(200).json(user);
})

module.exports = router;
