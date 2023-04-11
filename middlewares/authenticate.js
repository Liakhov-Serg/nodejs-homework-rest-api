const jwt = require('jsonwebtoken');

const HttpError = require('../helpers/HttpError');

const { User } = require("../models/user");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401));
  }
    try {
        console.log(token);
        const { id } = jwt.verify(token, SECRET_KEY);
        console.log(2222);
    const user = await User.findById(id);

    if (!user || !user.token) {
      next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;