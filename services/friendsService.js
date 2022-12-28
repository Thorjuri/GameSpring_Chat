const FriendsRepository = require("../repositories/friendsRepository");

class FriendsService {
    friendsRepository = new FriendsRepository();
    err = new Error('friendsService Error');

    createReq = async(sender, receiver)=> {
        const checkUser = await this.friendsRepository.checkUser(receiver);
        const checkReq = await this.friendsRepository.checkReq(sender, receiver);
        if(checkReq.length >0 ){
            this.err.status = 401;
            this.err.message = '이미 신청내역이 있습니다.';
            throw this.err;
        };
        if(!checkUser){
            this.err.status = 401;
            this.err.message = '유효하지 않은 회원입니다.';
            throw this.err;
        };
        if(checkUser.friends.list.indexOf(sender) >= 0){
            this.err.status = 401;
            this.err.message = '이미 친구인 회원입니다.';
            throw this.err;
        };
        if(sender === receiver){
            this.err.status = 401;
            this.err.message = '잘못된 접근입니다.';
            throw this.err;
        };
        const data = await this.friendsRepository.createReq(sender, receiver);
        return data;
    };

    getNewReq = async(receiver)=> {
        const data = await this.friendsRepository.getNewReq(receiver);
        return { message: `조회된 요청 ${ data.length }건`, data };
    };

    acceptReq = async(friendsId, loginId)=> {
        const requestInfo = await this.friendsRepository.getReqInfo(friendsId);
        if(!requestInfo){
            this.err.status = 401;
            this.err.message = '유효하지 않은 신청 정보입니다.';
            throw this.err;
        };

        const checkUser = await this.friendsRepository.checkUser(requestInfo.sender);
        if(!checkUser){
            this.err.status = 401;
            this.err.message = '신청자가 유효하지 않은 회원입니다.';
            throw this.err;
        };
        if(requestInfo.receiver !== loginId){
            this.err.status = 401;
            this.err.message = '잘못된 접근입니다.';
            throw this.err;
        };
        await this.friendsRepository.updateFriend(friendsId);
        await this.friendsRepository.updateUsers(requestInfo.sender, requestInfo.receiver);
        return { sender: requestInfo.sender, receiver: requestInfo.receiver, message: '친구 요청 수락 완료' };
    };

    rejectReq = async(friendsId, loginId)=> {
        const requestInfo = await this.friendsRepository.getReqInfo(friendsId);
        if(!requestInfo){
            this.err.status = 401;
            this.err.message = '유효하지 않은 신청 정보입니다.';
            throw this.err;
        };
        if(requestInfo.receiver !== loginId){
            this.err.status = 401;
            this.err.message = '잘못된 접근입니다.';
            throw this.err;
        };
        const data = await this.friendsRepository.deleteFriend(friendsId);
        return data;
    };

    getMyFriend = async(loginId)=> {
        const friend = await this.friendsRepository.getMyFriend(loginId);
        const result  = await Promise.all(friend.friends.list.map(async(val)=> {
            const user = await this.friendsRepository.checkUser(val);
            const createdAt = user.createdAt;
            return { Id: val, createdAt };
        }));
        return { message: `조회된 나의 친구 ${ friend.friends.list.length }명`, result };
    };

    dropFriend = async(loginId, friendId)=> {
        const checkUser = await this.friendsRepository.checkUser(loginId);
        if(checkUser.friends.list.indexOf(friendId) === -1){
            this.err.status = 401;
            this.err.message = '친구 정보가 존재하지 않습니다.';
            throw this.err;
        }
        const friendData = await this.friendsRepository.dropFriend(loginId, friendId); 
        await this.friendsRepository.dropRequest(loginId, friendId);
        return friendData;
    };
};

module.exports = FriendsService;
