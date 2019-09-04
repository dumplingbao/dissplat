const jwt = require('jsonwebtoken')
const {security} = require('../config/config')
/***
 *
 */
// 颁布令牌
const generateToken = function (uid, scope) {
    // const secretKey = global.config.security.secretKey;
    // const expiresIn = global.config.security.expiresIn;
    const secretKey = security.secretKey;
    const expiresIn = security.expiresIn;
    const token = jwt.sign({
        uid,
        scope
    }, secretKey, {
        expiresIn: expiresIn
    })
    return token
}

module.exports = {
    generateToken,
}