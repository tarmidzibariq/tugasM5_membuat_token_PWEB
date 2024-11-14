const { Users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env =require('dotenv').config().parsed;
class AuthController {
  generateToken = async(payload) => {

    const accessToken = jwt.sign(
      { userId: payload.id },
      env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: payload.id },
      env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  }

  // login
  login = async (req, res) => { 
    try {
      const user = await Users.findOne({ where: { email: req.body.email } });
      
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'invalid password' });
      }

      // generate token
      const { accessToken, refreshToken } = await this.generateToken(user);

      return res.status(200).json({
          message: "LOGIN_SUCCESS",
          accessToken: accessToken,
          refreshToken: refreshToken,
          user,
          // role:"user"
      });
      
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

  }
// async register(req, res) {
  register = async (req, res) => {
    // console.log(env);
    try {

      const { nama, email, password } = req.body;
      
      // check emaail is already registered
      const userExists = await Users.findOne({
        where: {
          email: email
        }
      });

      if (userExists) {
        return res.status(400).json({
          message: 'Email already registered',
        });
      }

      // create a new user  
      const user = await Users.create({
        nama: nama,
        email: email,
        password: bcrypt.hashSync(password, 10),
      });
  
      if (!user) {
        return res.status(400).json({ message: "CREATE_USER_FAILED" });
      }
  
      const {accessToken, refreshToken} = await this.generateToken(user);
     
      return res.status(200).json({
        message: "USER_CREATED",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user,
      });
      
    } catch (error) {

      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();