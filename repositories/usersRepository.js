const { Users, Friends } = require('../models');
const { Op } = require("sequelize");
require("dotenv").config();

class UsersRepository {
    err = new Error('userRepository Error');

    signup = async(loginId, password)=> {
        const data = await Users.create({ loginId, password });
        return { message: `${ loginId }님 회원가입을 축하드립니다.`};
    };  

    checkId = async(loginId)=> {
        const data = await Users.findOne({ where: { loginId } });
        return data;
    };

    getAllUsers = async(loginId)=> {
        const user = await Users.findAll({
            raw: true,
            attributes: [`loginId`, 'friends', 'createdAt'],
            where: { 
                [Op.not]: [{ loginId: loginId }]
            }
        });
        return user;
    };

};

module.exports = UsersRepository;
