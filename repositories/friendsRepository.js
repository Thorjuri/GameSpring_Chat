const { Users, Friends } = require('../models');
require("dotenv").config();

class FriendsRepository {

    checkUser = async(receiver)=> {
        const data = await Users.findOne({ where: { loginId: receiver }});
        return data;
    };

    createReq = async(sender, receiver)=> {
        const data = await Friends.create({ sender, receiver });
        return { message: `${receiver}님에게 친구요청 완료`, data };
    };

    getNewReq = async(receiver)=> {
        const data = await Friends.findAll({ where: { receiver } });
        return data;
    };

    getReqInfo = async(friendsId)=> {
        const data = await Friends.findOne({ whrer: { friendsId }});
        return data;
    };

    updateFriend = async(friendsId)=> {
            await Friends.update({ 
                confirm: true, 
                valid: true 
            },{
                where: { friendsId }
            });
            return { message: '친구요청 수락 완료' };
    };

    updateUsers = async(sender, receiver)=> {
        const senders = await Users.findOne({ where: { loginId: sender }});
        let senderData = senders.friends.list;
        senderData.push(receiver);
        await Users.update({
            friends: { list : senderData }
        },{
            where: { loginId: sender}
        });

        const receivers = await Users.findOne({ where: { loginId: receiver }});
        let receiverData = receivers.friends.list;
        receiverData.push(sender);
        await Users.update({
            friends:  { list : receiverData }
        },{
            where: { loginId: receiver }
        });
        return { message: '친구 등록 완료' };
    };    

    deleteFriend = async(friendsId)=> {
        await Friends.destroy({ where: { friendsId }});
        return { message: '친구요청 거절 및 삭제완료' };
    };

    getMyFriend = async(loginId)=> {
        const data = Users.findOne({ 
            attributes: ['friends'],
            where: { loginId }
        });
        return data;
    };

    dropFriend = async(loginId, friendId)=> {
        const user = await this.checkUser(loginId);
        let userData = user.friends.list;
        userData.splice(userData.indexOf(friendId), 1);
        const updateUser = await Users.update({
            friends:  { list : userData }
        },{
            where: { loginId }
        });

        const opponent = await this.checkUser(friendId);
        let friendData = opponent.friends.list;
        friendData.splice(friendData.indexOf(loginId), 1);
        const updateOpponent = await Users.update({
            friends: { list : friendData }
        },{
            where: { loginId: friendId }
        });

        return { message: '친구 삭제 완료' };
    };
};

module.exports = FriendsRepository;
