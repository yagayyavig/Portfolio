const { userModel, database } = require("../models/userModel");

const getUserByEmailIdAndPassword = (email, password) => {
  const user = userModel.findOne({ email });
  if (user && isUserValid(user, password)) {
    return user;
  }
  return null;
};

const getUserById = (id) => {
  return userModel.findById(id);
};

const addUser = (user) => {
  database.push(user); // Adds user to the fake DB
};

function isUserValid(user, password) {
  return user.password === password;
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  addUser,
};
