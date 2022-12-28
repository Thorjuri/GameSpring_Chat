const UsersService = require("../services/usersService");

class UsersController {
    usersService = new UsersService();

    signup = async(req, res)=> {
        const { loginId, password } = req.body;
        const data = await this.usersService.signup(loginId, password);
        res.status(201).send(data);
    };

    checkId = async(req, res)=> {
        const { loginId } = req.body;
        const data = await this.usersService.checkId(loginId);
        res.status(200).send(data);
    };

    login = async(req, res)=> {
        const { loginId, password } = req.body;
        const data = await this.usersService.login(loginId, password);
        res.status(200).send(data);
    };

    getAllUsers = async(req, res)=> {
        const { loginId } = res.locals.user;
        const data = await this.usersService.getAllUsers(loginId);
        res.status(200).send(data);
    };
};

module.exports = UsersController;
