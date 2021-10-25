const { UserService } = require('../services');

class UserController {
	static async registerUser(req) {
		const userData = req.body;
		const userRecord = await UserService.signUp(userData);
		console.log('In controller', userRecord);
		return userRecord;
	}
}

module.exports = UserController;
