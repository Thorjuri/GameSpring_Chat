const express = require("express");
const router = express.Router();
const auth_middleware = require("../middlewares/auth_middleware");
const FriendsController = require("../controllers/friendsController");
const friendsController = new FriendsController();
const wrapAsyncController = require('../middlewares/wrapAsyncController');

router.post('/', auth_middleware, wrapAsyncController(friendsController.createReq));
router.get('/', auth_middleware, wrapAsyncController(friendsController.getNewReq));
router.post('/add', auth_middleware, wrapAsyncController(friendsController.acceptReq));
router.delete('/add', auth_middleware, wrapAsyncController(friendsController.rejectReq));
router.get('/me', auth_middleware, wrapAsyncController(friendsController.getMyFriend));
router.patch('/me', auth_middleware, wrapAsyncController(friendsController.dropFriend))


module.exports = router;