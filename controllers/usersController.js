const UsersService = require("../services/usersService");

class UsersController {
    usersService = new UsersService();

    signup = async(req, res)=> {
        const { loginId, password } = req.body;
        const data = await this.usersService.signup(loginId, password);
        res.send(data);
    };

    checkId = async(req, res)=> {
        const { loginId } = req.body;
        const data = await this.usersService.checkId(loginId);
        res.send(data);
    };

    login = async(req, res)=> {
        const { loginId, password } = req.body;
        const data = await this.usersService.login(loginId, password);
        res.send(data);
    };

    getAllUsers = async(req, res)=> {
        const data = await this.usersService.getAllUsers();
        res.send(data);
    };
};

module.exports = UsersController;
