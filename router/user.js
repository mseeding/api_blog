const express = require('express');
// 创建路由对象
const router = express.Router();
//引入路由函数模块
const userRouter = require('../router_handler/user');

//-----------------------------------------------------


// 注册新用户
router.post('/user/register', userRouter.register);

// 登录
router.post('/user/login', userRouter.login);


//-----------------------------------------------------
// 将路由对象共享出去
module.exports = router