const FriendsRepository = require("../repositories/friendsRepository");

class FriendsService {
    friendsRepository = new FriendsRepository();
    err = new Error('friendsService Error');

    createReq = async(sender, receiver)=> {
        const checkUser = await this.friendsRepository.checkUser(receiver);
        if(!checkUser){
            this.err.status = 401;
            this.err.message = '유효하지 않은 회원입니다.';
            throw this.err;
        };
        const data = await this.friendsRepository.createReq(sender, receiver);
        return data;
    };

    getNewReq = async(receiver)=> {
        const data = await this.friendsRepository.getNewReq(receiver);
        return { message: `조회된 요청 ${data.length}건`, data };
    };

    acceptReq = async(friendsId)=> {
        const requestInfo = await this.friendsRepository.getReqInfo(friendsId);
        console.log("---------1---------", requestInfo)
        if(!requestInfo){
            this.err.status = 401;
            this.err.message = '유효하지 않은 신청 정보입니다.';
            throw this.err;
        };
        //friend테이블, users테이블 모두 업데이트
        await this.friendsRepository.updateFriend(friendsId);
        await this.friendsRepository.updateUsers(requestInfo.sender, requestInfo.receiver);
        return { sender: requestInfo.sender, receiver: requestInfo.receiver, message: '친구 요청 수락 완료' };
    };

    rejectReq = async(friendsId)=> {
        const requestInfo = await this.friendsRepository.getReqInfo(friendsId);
        if(!requestInfo){
            this.err.status = 401;
            this.err.message = '유효하지 않은 신청 정보입니다.';
            throw this.err;
        };
        const data = await this.friendsRepository.deleteFriend(friendsId);
        return data;
    };

    getMyFriend = async(loginId)=> {
        const data = await this.friendsRepository.getMyFriend(loginId);
        return { message: `조회된 나의 친구 ${data.friends.list.length}명`,  data };
    };

    dropFriend = async(loginId, friendId)=> {
        //friend테이블, users테이블 모두 업데이트
        const data = await this.friendsRepository.dropFriend(loginId, friendId); 
        return data;
    };

};
module.exports = FriendsService;
