module.exports = {
    database: {
        dbName: 'dissplat',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root'
    },
    security: {
        secretKey: "secretKey",
        expiresIn: 60 * 60 // 过期时间 1小时
    }
}
