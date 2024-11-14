const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const auth = require("../middleware/auth.js");
const user = require("../middleware/isUser.js");
const admin = require("../middleware/isAdmin.js");

router.post("/",[auth(), admin()] ,userController.store);
router.get("/", [auth(), user()],  userController.index); // Add auth middleware here
router.get("/:id",[auth(), user()], userController.show);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);



module.exports = router;