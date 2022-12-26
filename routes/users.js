const express = require("express");
const router = express.Router();
const auth_middleware = require("../middlewares/auth_middleware");
const UsersController = require("../controllers/usersController");
const usersController = new UsersController();
const wrapAsyncController = require('../middlewares/wrapAsyncController');

router.post('/signup', wrapAsyncController(usersController.signup));
router.post('/checkId', wrapAsyncController(usersController.checkId));
router.post('/login', wrapAsyncController(usersController.login));
router.get('/', auth_middleware, wrapAsyncController(usersController.getAllUsers));


module.exports = router;