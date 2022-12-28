const FriendsService = require("../services/friendsService");

class FriendsController {
    friendsService = new FriendsService();

    createReq = async(req, res)=> {
        const { receiver } = req.body;
        const sender = res.locals.user.loginId;
        const data = await this.friendsService.createReq(sender, receiver);
        res.status(201).send(data);
    };

    getNewReq = async(req, res)=> {
        const receiver = res.locals.user.loginId;
        const data = await this.friendsService.getNewReq(receiver);
        res.status(201).send(data);
    };

    acceptReq = async(req, res)=> {
        const { friendsId } = req.body;
        const { loginId } = res.locals.user;
        const data = await this.friendsService.acceptReq(friendsId, loginId);
        res.status(201).send(data);
    };

    rejectReq = async(req, res)=> {
        const { friendsId } = req.body;
        const { loginId } = res.locals.user;
        const data = await this.friendsService.rejectReq(friendsId, loginId);
        res.status(201).send(data);
    };

    getMyFriend = async(req, res)=> {
        const { loginId } = res.locals.user;
        const data = await this.friendsService.getMyFriend(loginId);
        res.status(201).send(data);
    };

    dropFriend = async(req, res)=> {
        const { loginId } = res.locals.user;
        const { friendId } = req.body;
        const data = await this.friendsService.dropFriend(loginId, friendId);
        res.status(201).send(data);
    };

}
module.exports = FriendsController;