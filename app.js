// 导入 express 模块
const express = require('express');
// 创建 express 的服务器实例
const app = express();


//=========================注册中间件================================
// 导入 cors 跨域中间件
const cors = require('cors');
// 将 cors 注册为全局中间件
app.use(cors());
//配置解析 `application/x-www-form-urlencoded` 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    //status=0说明执行成功，status=1说明出错
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})


//--------------------------注册路由----------------------------------
// 导入并注册用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);

//------------------注册全局错误中间件----------------------------------
const joi = require('joi')
app.use(function(err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err);
    // 未知错误
    if (err) return res.cc(err)
    res.cc(err)
})


//==================================================
// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8080, function() {
    console.log('The api server running at http://127.0.0.1:8080')
})