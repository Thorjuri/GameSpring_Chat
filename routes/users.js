const express = require("express");
const router = express.Router();
const auth_middleware = require("../middlewares/auth_middleware");
const UsersController = require("../controllers/usersController");
const usersController = new UsersController();
const wrapAsyncController = require('../middlewares/wrapAsyncController');

router.post('/signup', wrapAsyncController(usersController.signup)); //회원가입
router.post('/checkId', wrapAsyncController(usersController.checkId)); //ID 중복확인
router.post('/login', wrapAsyncController(usersController.login)); //로그인
router.get('/', auth_middleware, wrapAsyncController(usersController.getAllUsers)); //전체유저 조회

module.exports = router;