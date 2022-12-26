const express = require("express");
const router = express.Router();
const usersRouter = require("./users.js");
const friendsRouter = require("./friends.js");

router.use("/users", usersRouter);
router.use("/friends", friendsRouter);

module.exports = router;
