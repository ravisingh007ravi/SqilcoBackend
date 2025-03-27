const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticate = (req, res, next) => {
  try {
    
    let token = req.headers["x-api-key"];
    
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, process.env.UserJWTToken);

    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

    next();
  }
  catch (error) {
    res.status(500).send({ staus: false, msg: error });
  }
}

const authorize = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];

    let id = req.params.userId

    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, process.env.UserJWTToken);

    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });

    if (id == decodedToken.userId) return next();
    else return res.status(403).send({ status: false, msg: "you are not authorised !" });

  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }
}

module.exports = { authenticate, authorize };