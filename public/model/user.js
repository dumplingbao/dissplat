const moment = require('moment');
const bcrypt = require('bcryptjs')
const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('../utils/db')

class User extends Model {}
User.init({
    // attributes
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // 昵称
    nickname: Sequelize.STRING,
    // 邮箱
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    // 密码
    password: {
        type: Sequelize.STRING,
        set(val) {
            // 加密
            const salt = bcrypt.genSaltSync(10);
            // 生成加密密码
            const psw = bcrypt.hashSync(val, salt);
            this.setDataValue("password", psw);
        }
    },
    created_at: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD');
        }
    }
}, {
    sequelize,
    modelName: 'users'
    // options
});
module.exports = {
    User
}