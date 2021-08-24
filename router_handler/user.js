const userSchema = require('../schema/user');
const db = require('../db/mysql')
const bcrpty = require('bcryptjs')
const jwt = require('jsonwebtoken')
    // 导入配置文件
const config = require('../config')
    // 注册
exports.register = (req, res) => {
    //测试请求数据
    // console.log(req.body);
    var userinfo = req.body;
    const { error, value } = userSchema.validate({ username: userinfo.username, password: userinfo.password });
    console.log(error, value);
    if (error) {
        // console.log(error.details[0].message);
        return res.cc('用户名和密码验证不通过，请输入符合规则的用户名和密码进行注册！Error:' + error.details[0].message)
    }

    //判断注册用户名是否存在
    sqlStrFind = `select * from user where username = ?`;
    db.query(sqlStrFind, userinfo.username, (err, results) => {
        //执行sql语句失败
        if (err) return res.cc(err);
        if (results.length > 0) return res.cc('用户名已存在，请更换用户名重试~~');
        //注册写入数据库
        sqlStrCreate = `insert into user set ?`;
        userinfo.password = bcrpty.hashSync(userinfo.password, 10)
        db.query(sqlStrCreate, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows == 1) {
                res.cc('注册成功，用户名为：' + userinfo.username)
            }
        })
    })

}

// 登录
exports.login = (req, res) => {
    //1、根据用户名查询密码，2、密码比对
    const userinfo = req.body;
    // console.log(userinfo.username);
    const sql = `select * from user where username = ?`
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('登陆失败！')

        //根据用户名查询密码并进行比对
        console.log(results[0].password);
        // const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // console.log(compareResult);



        //返回客户端token信息
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = {...results[0], password: null };
        // console.log(user);
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时
        })

        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
        })

    })

}


//注销/退出