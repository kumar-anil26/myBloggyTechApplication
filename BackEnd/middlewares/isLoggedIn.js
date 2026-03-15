const jwt = require("jsonwebtoken");
const User = require("../models/Users/User");

exports.isLoggedIn = (req, res, next) => {
  //Fetch token from request
  const token = req.headers.authorization?.split(" ")[1];

  //Token verify
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      const error = new Error(err?.message);
      next(error);
    } else {
      const userId = decoded?.user?.id;
      const userData = await User.findById(userId).select(
        "username email role _id"
      );
      req.userAuth = userData;
      next();
    }
  });
};
