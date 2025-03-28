const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers["x-api-key"];
    console.log(token)

    if (!token) return res.status(400).send({ status: false, msg: "Token must be present" });

    const decodedToken = jwt.verify(token, process.env.UserJWTToken);

    if (!decodedToken) return res.status(401).send({ status: false, msg: "Token is invalid" });

    req.user = decodedToken;
    next();
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message || "Internal Server Error" });
  }
};

exports.authorize = (req, res, next) => {
  try {

    if (!req.user) return res.status(401).send({ status: false, msg: "Unauthorized access" });


    const userIdFromToken = req.user.userId;
    const requestedUserId = req.params.userId;

    if (userIdFromToken === requestedUserId) return next();


    return res.status(403).send({ status: false, msg: "You are not authorized!" });
  }
  catch (error) {
    res.status(500).send({ status: false, msg: error.message || "Internal Server Error" });
  }
};


