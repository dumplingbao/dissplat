const {User} = require('../model/user')
const bcrypt = require('bcryptjs')

class UserDao {
    // 创建用户
    static async createUser(v) {

        const hasUser = await User.findOne({
            where: {
                email: v.email,
                deleted_at: null
            }
        });
        
        if (hasUser) {
            throw new global.errs.Existing('用户已存在');
        }

        const user = new User();
        user.email = v.email;
        user.password = v.password;
        user.nickname = v.nickname;

        return user.save();
    }
    // 验证密码
    static async verifyEmailPassword(email, plainPassword) {

        // 查询用户是否存在
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (!user) {
            throw new global.errs.AuthFailed('账号不存在')
        }
        // 验证密码是否正确
        const correct = bcrypt.compareSync(plainPassword, user.password);
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
    }
    // 删除用户
    static async destroyUser(id) {
        const user = await User.findOne({
            where: {
                id,
                deleted_at: null
            }
        });
        if (!user) {
            throw new global.errs.NotFound('没有找到此用户');

        }
        user.destroy()
    }

    // 获取用户详情
    static async getUserInfo(id) {
        const user = await User.findOne({
            where: {
                id
            }
        });
        if (!user) {
            throw new global.errs.NotFound('没有找到用户信息');
        }

        return user
    }

    // 更新用户
    static async updateUser(id, v) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new global.errs.NotFound('没有找到用户信息');
        }
        user.email = v.get('query.email');
        user.password = v.get('query.password2');
        user.nickname = v.get('query.nickname');

        user.save();
    }


    // 用户列表
    static async getUserList(page = 1) {
        const pageSize = 10;
        const user = await User.findAndCountAll({
            limit: pageSize,//每页10条
            offset: (page - 1) * pageSize,
            where: {
                deleted_at: null
            },
            order: [
                ['created_at', 'DESC']
            ]
        })

        return {
            data: user.rows,
            meta: {
                current_page: parseInt(page),
                per_page: 10,
                count: user.count,
                total: user.count,
                total_pages: Math.ceil(user.count / 10),
            }
        };
    }
}

module.exports = {
    UserDao
}