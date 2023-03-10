const SocketIo = require("socket.io");

module.exports = (http) => {
    const io = SocketIo(http);

    function publicRooms() {
        const {
            sockets: {
                adapter: { sids, rooms },
            },
        } = io;
        const publicRooms = [];
        rooms.forEach((_, key) => {
            if (sids.get(key) === undefined) {
                publicRooms.push(key);
            };
        });
        return publicRooms;
    };

    // 전체 접속자 수 추출
    function findUser() {
        const {
            sockets: {
                adapter: { sids, rooms },
            },
        } = io;
        const allUsers = [];
        sids.forEach((val, key) => {
            allUsers.push(key);
        });
        return allUsers;
    };

    function findRoom(room) {
        const {
            sockets: {
                adapter: { sids, rooms },
            },
        } = io;
        const roomid = [];
        sids.forEach((val, key) => {
            if (key === room) {
                roomid.push(key);
            }
        });
        return roomid;
    };

    // room 참여자 수 추출
    function countRoom(roomName) {
        return io.sockets.adapter.rooms.get(roomName)?.size;
    };

    io.on("connection", (socket) => {
        const userNum1 = countRoom("1");
        const userNum2 = countRoom("2");
        socket.emit("list", (userNum1, userNum2));

        socket.on("enterRoom", (obj)=> {
            const convert = JSON.parse(obj);
            const { roomNum, nickname } = convert;
            console.log("---------enterRoom---------", roomNum)
            socket.join(roomNum);
            const message = `${nickname}님이 ${roomNum}방에 입장하셨습니다.`;
            const userNum = countRoom(roomNum);
            io.sockets.in(roomNum).emit("welcome", message, roomNum, userNum);
        });

        socket.on("chat", (obj)=> {
            const convert = JSON.parse(obj);
            const { roomNum , nickname, message } = convert;
            io.sockets.in(roomNum).emit("contents", roomNum, nickname, message);

        });

        socket.on('disconnect', ()=> {
            const message = `상대방이 퇴장했습니다`;
            socket.broadcast.emit('leaveUser', message);
        });
    });
};
