const {
  checkName,
  checkUsername,
  checkPassword,
  badRequestError,
  notFoundError,
  internalServerError,
} = require("../helpers");
const { user } = require("../config/mongoCollections");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const saltRounds = 11;

const getUserByUsername = async (username) => {
  // Validations
  try {
    checkUsername(username);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  username = username.trim().toLowerCase();
  
  // Mongo Collection operations
  try {
    const userCollection = await user();
    const userFound = await userCollection.findOne({ username: username });
    if (!userFound || userFound === null) return false;
    return userFound;
  } catch (err) {
    throw err;
  }
};

const getUserByEmail = async (email) => {
  // Validations
  try {
    checkUsername(email);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  email = email.trim().toLowerCase();
  
  // Mongo Collection operations
  try {
    const userCollection = await user();
    const userFound = await userCollection.findOne({ email: email });
    if (!userFound || userFound === null) return false;
    return userFound;
  } catch (err) {
    throw err;
  }
};

const createUser = async (name, username, password, email) => {
  // Validations
  try {
    checkName(name);
    checkUsername(username);
    checkPassword(password);
    checkEmail(email);

    const existingUser = await getUserByUsername(username);
    if (existingUser) throw `Username already taken!`;

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) throw `Email already in use!`;
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  username = username.trim().toLowerCase();
  name = name.trim();
  password = password.trim();
  email = email.trim();

  // Mongo Collection operations and password hashing
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const userCollection = await user();
    let newUser = {
      username,
      name,
      email,
      password: hash
    };

    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw internalServerError("Could not add user");
    
    const newlyCreatedUser = await userCollection.findOne({_id: new ObjectId(insertInfo.insertedId.toString())});
    delete newlyCreatedUser.password;
    return newlyCreatedUser;
  } catch (err) {
    throw err;
  }
};


const checkUser = async (username, password) => {
  // Validations
  try {
    checkUsername(username);
    checkPassword(password);
  } catch (err) {
    throw badRequestError(err);
  }

  // Trim inputs
  username = username.trim().toLowerCase();
  password = password.trim();

  // Mongo Collection operations
  try {
    const existingUser = await getUserByUsername(username);

    if (!existingUser) throw notFoundError("The username or password is incorrect");

    const comparePasswords = await bcrypt.compare(password, existingUser.password);
    if (comparePasswords) {
      delete existingUser.password;
      return existingUser;
    } else throw badRequestError("The username or password is incorrect");
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  checkUser,
};