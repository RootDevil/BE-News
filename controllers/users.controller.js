const { selectUsers, selectUserByUsername } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  }
  catch(err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const user = await selectUserByUsername(req.params.username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
