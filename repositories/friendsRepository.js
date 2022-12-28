const { Users, Friends } = require('../models');
const { Op } = require("sequelize");
require("dotenv").config();

class FriendsRepository {

    checkUser = async(receiver)=> {
        const data = await Users.findOne({ where: { loginId: receiver } });
        return data;
    };
 
    checkReq = async(sender, receiver)=> {
        const data = await Friends.findAll({
            where: { 
                [Op.or] :[{
                    [Op.and]: [{ sender }, { receiver }]
                },{
                    [Op.and]: [{ sender: receiver }, { receiver: sender }]
                }]
            }
        });
        return data;
    };

    createReq = async(sender, receiver)=> {
        const data = await Friends.create({ sender, receiver });
        return { message: `${ receiver }님에게 친구요청 완료`, data };
    };

    getNewReq = async(receiver)=> {
        const data = await Friends.findAll({ 
            where: { 
                receiver,
                confirm: false,
                valid: true,
                [Op.not]: [{ sender: receiver }]
            }
        });
        return data;
    };

    getReqInfo = async(friendsId)=> {
        console.log(friendsId)
        const data = await Friends.findOne({ 
            where: { 
                friendsId,
                valid: true
            } 
        });
        console.log(data)
        return data;
    };

    updateFriend = async(friendsId)=> {  //(수락)요청내역 업데이트
            await Friends.update({ 
                confirm: true, 
                valid: false 
            },{
                where: { friendsId }
            });
            return { message: '친구요청 수락 완료' };
    };

    updateUsers = async(sender, receiver)=> {
        const senders = await Users.findOne({ where: { loginId: sender } }); //(수락)요청자 친구목록 업데이트
        let senderData = senders.friends.list;
        senderData.push(receiver);
        await Users.update({
            friends: { list : senderData }
        },{
            where: { loginId: sender}
        });

        const receivers = await Users.findOne({ where: { loginId: receiver } }); //(수락)수신자 친구목록 업데이트
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
        await Friends.destroy({ where: { friendsId } }); //(거절)요청내역 삭제
        return { message: '친구요청 거절 및 삭제완료' };
    };

    getMyFriend = async(loginId)=> {
        const data = Users.findOne({ 
            attributes: ['friends'],
            where: { loginId }
        });
        return data;
    };

    dropFriend = async(loginId, friendId)=> {  //(친구삭제)본인 친구목록 업데이트
        const user = await this.checkUser(loginId);
        let userData = user.friends.list;
        userData.splice(userData.indexOf(friendId), 1);
        await Users.update({
            friends:  { list : userData }
        },{
            where: { loginId }
        });

        const opponent = await this.checkUser(friendId);  //(친구삭제)상대방 친구목록 업데이트
        let friendData = opponent.friends.list;
        friendData.splice(friendData.indexOf(loginId), 1);
        await Users.update({
            friends: { list : friendData }
        },{
            where: { loginId: friendId }
        });
        return { message: '친구 삭제 완료' };
    };

    dropRequest = async(loginId, friendId)=> {  //(친구삭제) 요청내역 삭제
        await Friends.destroy({
            where: { 
                [Op.or] :[{
                    [Op.and]: [{ sender: loginId }, { receiver: friendId }]
                },{
                    [Op.and]: [{ sender: friendId }, { receiver: loginId }]
                }]
            }
        });
    };
};

module.exports = FriendsRepository;
