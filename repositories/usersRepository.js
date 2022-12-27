const { Users, Friends } = require('../models');
require("dotenv").config();

class UsersRepository {
    err = new Error('userRepository Error');

    signup = async(loginId, password)=> {
        const data = await Users.create({ loginId, password });
        return { message: `${loginId}님 회원가입을 축하드립니다.`};
    };  

    checkId = async(loginId)=> {
        const data = await Users.findOne({ where: { loginId } });
        return data;
    };

    getAllUsers = async()=> {
        const user = await Users.findAll({
            attributes: [`loginId`, 'friends', 'createdAt']
        });

        // const userData = user.map(async(val)=> {
        //     const friend = await Friends.findAll({ 
        //         where: { 
        //             loginId: val.loginId,
        //             confirm: true,
        //             valid: true
        //         }});
        //     return { loginId: val.loginId, friends: friend.length }
        // });

        return user;
    };

};

module.exports = UsersRepository;
