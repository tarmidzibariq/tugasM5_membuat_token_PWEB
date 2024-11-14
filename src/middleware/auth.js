const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const auth = () => {
    return async(req, res, next) => {
      try {
        if (!req.headers["authorization"]) throw { message: "TOKEN_REQUIRED" };
        const token = req.header('Authorization').split(" ")[1];
        // const token = req.header('Authorization');
        if (!token) {
          throw{message: "TOKEN_EMPTY"}
        }

        // VERIFY token
        const verified = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        
        if (!verified) {
          throw{message: "UNAUTHORIZE"}
        }
        const user = await Users.findOne({ where: verified.userID });
        req.user = {
          id: user.id,
          nama: user.nama,
          email: user.email,

          role:"admin"
        }
        // console.log(token);
        next();

    } catch (error) {
      if (error.message == "invalid token") {
          error.message = "INVALID_TOKEN";
      } else if (error.message == "jwt expired") {
          error.message = "TOKEN_EXPIRED";
      }
      return res.status(400).json({message : error.message})
    } 
  }
}

module.exports = auth