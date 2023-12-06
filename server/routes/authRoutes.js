//require express, express router and bcrypt as shown in lecture code
const express = require("express");
const router = express.Router();
const { checkUser, createUser } = require("../data/users");
const {
  checkName,
  checkPassword,
  checkUsername,
  notFoundError,
  badRequestError,
  internalServerError,
} = require("../helpers");

// client.connect().then(() => {});

router.route("/signup").post(async (req, res) => {
  //code here for POST
  let { username, name, password, email } = req.body;
    
  try {
    checkEmail(email);
    checkUsername(username);
    checkName(name);
    checkPassword(password);
  } catch (err) {
    return res
      .status(err?.status ?? 400)
      .json({ error: err?.message ?? err ?? "Bad Request: Please check your inputs" });
  }

  try {
    email = email.trim();
    username = username.trim();
    name = name.trim();
    password = password.trim();
    const user = await createUser(name, username, password, email);

    // if (!user) throw notFoundError(`User ${username} not found`);
    return res.status(200).json(user);
  } catch (err) {
    
    return res
      .status(err?.status ?? 500)
      .json({ error: err?.message ?? err ?? "Internal Server Error", foundUser: err?. foundUser });
  }
});

router.route("/login").post(async (req, res) => {
  //code here for POST
  try {
    const { username, password } = req.body;
    checkUsername(username);
    checkPassword(password);
  } catch (err) {
    return res
      .status(err?.status ?? 400)
      .json({ error: err?.message ?? "Bad Request: Please check your inputs" });
  }

  try {
    let { username, password } = req.body;
    username = username.trim();
    password = password.trim();
    if (req.session.user) throw badRequestError("A user is already logged in!");

    const user = await checkUser(username, password);


    if (!user) throw notFoundError(`User ${username} not found`);
    req.session.user = user;
    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(err?.status ?? 500)
      .json({ error: err?.message ?? "Internal Server Error" });
  }
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  try {
    if (!req.session.user) throw badRequestError("Cannot log out when session doesn't exist!");

  req.session.destroy();
  return res.status(200).json("Logged out");
  } catch (err) {
    return res.status(err?.status ?? 500).json({error: err?.message ?? err ?? "Internal Server Error"});
  }
});

module.exports = router;
