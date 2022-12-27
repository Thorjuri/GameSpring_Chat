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
    }
    });
    return publicRooms;
}

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
}

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
}

// room의 접속자 수 추출
function countRoom(roomName) {
    return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket) => {
    const userNum1 = countRoom("1")
    const userNum2 = countRoom("2")
    // console.log(userNum1, userNum2)
    socket.emit("list", (userNum1, userNum2))

    socket.on("connection", (obj)=> {
        const convert = JSON.parse(obj);
        const { roomNum, nickname } = convert;
        console.log("---------roomNumber---------",roomNum )
        socket.join(roomNum)
        const message = `${nickname}님이 ${roomNum}방에 입장하셨습니다.`
        const userNum = countRoom(roomNum)
        io.sockets.in(roomNum).emit("welcome", message, roomNum, userNum)
        // console.log("---1---", roomNum )
    })

    socket.on("chat", (obj)=> {
        const convert = JSON.parse(obj);
        const { roomNum , nickname, message } = convert;
        io.sockets.in(roomNum).emit("contents", roomNum, nickname, message)
        // console.log("---2---", roomNum , nickname, message )
        // console.log("---현재 접속자---", findUser())
    } )

    socket.on("disconnecting", (nickname) => {
    // console.log("---퇴장 후 잔여 접속자---", findUser())
    const message = `${nickname} 님이 퇴장하셨습니다.`;
    socket.emit("chat", message); 
    });

    socket.on("disconnect", (nickname) => {
    console.log("---퇴장 후 잔여 접속자---", findUser())

    });
});
};
