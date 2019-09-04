const Router = require('koa-router')

const {UserDao} = require('../public/dao/user')
const {Resolve} = require('../public/utils/help');
const {UserService} = require('../public/service/user')
const {Auth} = require('../public/utils/auth')
const res = new Resolve();
const AUTH_ADMIN = 16;
const router = new Router({
    prefix: '/api/user'
})

// 创建
router.post('/create', async (ctx, next) => {
    await next();
    const v = ctx.request.body;
    const r = await UserDao.createUser(v);
    const data = {
        id: r.getDataValue('id'),
        email: r.getDataValue('email'),
        nickname: r.getDataValue('nickname'),
        created_at: r.getDataValue('created_at')
    };

    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(data);
})

// 登录
router.post('/login', async (ctx, next) => {
    await next();
    const v = ctx.request.body;
    let token = await UserService.login(v.email, v.password);
    ctx.response.status = 200;
    const data = {
        code: 200,
        msg: '登录成功',
        token
    }   
    ctx.body = res.json(data);
});
// 获取用户信息
router.get('/auth', new Auth(AUTH_ADMIN).m, async (ctx) => {
    // 获取用户ID
    const id = ctx.auth.uid;
    // 查询用户信息
    let userInfo = await UserDao.getUserInfo(id);
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(userInfo)
})

// 获取用户信息
router.get('/', async (ctx) => {
    // 获取用户ID
    const id = ctx.request.body.id;
    // 查询用户信息
    let userInfo = await UserDao.getUserInfo(id);
    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(userInfo)
})
// 删除
router.delete('/delete/:id', async (ctx) => {

    // 获取ID参数
    const id = ctx.get('path.id');
    await UserDao.destroyUser(id);

    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('删除成功')
})

// 修改
router.put('/update/:id', async (ctx) => {

    // 获取分类ID参数
    const id = ctx.get('path.id');
    await UserDao.updateUser(id, ctx);

    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.success('更新成功')
})

// 获取列表
router.get('/findList', async (ctx) => {
    const page = ctx.query.page;
    let userList = await UserDao.getUserList(page);

    // 返回结果
    ctx.response.status = 200;
    ctx.body = res.json(userList);

})

module.exports = router
