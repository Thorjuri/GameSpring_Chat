const UsersRepository = require("../repositories/usersRepository");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UsersService {
    usersRepository = new UsersRepository();
    err = new Error('usersService Error');

    signup = async(loginId, password)=> {
        if(!loginId || !password){
            this.err.status = 400;
            this.err.message = '아이디 및 비밀번호를 입력해주세요.';
            throw this.err;
        };
        if(password.length < 5){
            this.err.status = 400;
            this.err.message = '비밀번호는 5자리 이상이어야 합니다.';
            throw this.err;
        };
        const salt = bcrypt.genSaltSync(10);
        const hashedPW = bcrypt.hashSync(password, salt);
        password = hashedPW;
        const data = await this.usersRepository.signup(loginId, password);
        return data;
    };

    checkId = async(loginId)=> {
        if(!loginId){
            this.err.status = 400;
            this.err.message = '아이디를 입력해주세요.';
            throw this.err;
        };
        const data = await this.usersRepository.checkId(loginId);

        if(data){
            return { message : '중복된 아이디 입니다.' };
        }else{
            return { message : '사용 가능한 아이디 입니다.' };
        };
    };

    login = async(loginId, password)=> {
        if(!loginId || !password){
            this.err.status = 400;
            this.err.message = '아이디 및 비밀번호를 입력해주세요.';
            throw this.err;
        };
        const user = await this.usersRepository.checkId(loginId);
        if(!user){
            this.err.status = 400;
            this.err.message = '아이디 또는 패스워드를 확인해주세요';
            throw this.err;
        };

        const checkPass = await bcrypt.compare(password, user.password);
        if(!checkPass){
            this.err.status = 400;
            this.err.message = '아이디 또는 패스워드를 확인해주세요';
            throw this.err;
        };
        const accessToken = jwt.sign({ loginId: user.loginId }, process.env.SECRET_KEY,
            {
                expiresIn: '1d'
            });

        return { loginId: user.loginId, accessToken: `Bearer ${ accessToken }` };
    };

    // 친구 여부도 추가해서 보내야함(친구 아닐경우만 친구요청 버튼 노출)
    getAllUsers = async(loginId)=> {
        const data = await this.usersRepository.getAllUsers();
        const isFriend = data.map((val)=> {
            if(val.friends.list.indexOf(loginId) === -1){
                return { val, friend: false };
            }else{
                return { val, friedn: true };
            };
        });
        return { message: `조회된 유저 ${data.length}명`, isFriend }; 
    };
};

module.exports = UsersService;
