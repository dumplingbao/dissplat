const {UserDao} = require('../dao/user')
const {generateToken} = require('../utils/util')
const {Auth} = require('../utils/auth')


class UserService {
    // 管理员登录
    static async login(email, password) {
        // 验证账号密码是否正确
        const user = await UserDao.verifyEmailPassword(email, password);
        return generateToken(user.id, Auth.ADMIN)
    }
}

module.exports = {
    UserService
}