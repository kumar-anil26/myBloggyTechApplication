const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 3600 });
  return token;
};
