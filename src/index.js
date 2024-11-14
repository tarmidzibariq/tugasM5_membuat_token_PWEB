const express = require("express");
const users = require("./router/Users.js");
const auth = require("./router/Auth.js");

var app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use("/users", users);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});