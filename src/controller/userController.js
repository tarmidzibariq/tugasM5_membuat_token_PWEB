const {
  Users
} = require('../models');
const bcrypt = require('bcrypt');
class UserController {
  async store(req, res) {
    try {
      const {
        nama,
        email,
        password
      } = req.body;

      const user = await Users.create({
        nama: nama,
        email: email,
        password: bcrypt.hashSync(password, 10),
      })

      return res.json(user);

    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  async index(req, res) {
    try {
      const { page, pageSize } = req.query;

      const offset = Number((page - 1) * pageSize) || 0;
      const limit = Number(pageSize) || 10;

      const users = await Users.findAndCountAll({
        offset: offset,
        limit: limit
      });
      return res.json({
        data: users.rows,
        total: users.count,
        page: Number(page) || 1,
        pageSize: Number(limit),
      });

    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }
  
  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await Users.findByPk(id);
  
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nama, email, password } = req.body;

      const user = await Users.update({
          nama: nama,
          email: email,
          password: bcrypt.hashSync(password,10)
        },
        { where: { id: id } },
      )

      return res.json({message: "UPDATE SUCCESSFUL"});
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await Users.destroy({ where: { id: id } });

      return res.json({ message: "DELETE SUCCESSFUL" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new UserController();