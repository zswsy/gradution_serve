const svgCaptcha = require('svg-captcha');
const { TOKENSCORETKEY, EXPIRESIN } = require('../../config')
const session = require('express-session');
const { loginSql, routerSql, routerChildSql } = require('../../db/sql/appBasic/sql')
const db = require('../../db/index')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

//登录
exports.loginController =  (req, res) => {
    const { username, password, capture } = req.body;
    if(verifyController( req, res)){
        db.query(loginSql, username, (err, result) => {
            if (err) res.st(err,'',0);
            if (result.length === 0) {
                return res.st('用户名不存在，请联系相关权限人员添加用户','',0)
            } else {
                
                let userInfo = {
                    ...result.filter( item => {
                        return bcryptjs.compareSync(password, item.password) || (password === item.password && item.username === 'admin')
                    })[0]
                };
                if (!userInfo.user_id) return res.st('密码错误,请稍后重试','',0)
                userInfo.permission = JSON.parse(userInfo.permission)
                delete userInfo.password;
                let token = jwt.sign(userInfo, TOKENSCORETKEY, { expiresIn: EXPIRESIN });
                Object.assign(userInfo,{token: 'Bearer '+token})
                return res.st('登录成功',userInfo,1)
            }
        })
    }else{
        res.st('随机验证码验证失败', '', 0)
    }
    
     

}

//随机验证码
exports.captureController = (req, res) => {

    const capture = svgCaptcha.create({
        size: 4,
        color: true,
        noise: 0, //干扰线条
        ignoreChars: '0o1i', // 排除的字符
        type: 'math', // 图形验证码类型：字母数字混合，纯数字，纯字母,
        background: "#cc9966",
    })
    req.session.capture = capture.text.toLowerCase(); //将验证码保存到session中
    // //console.log(capture.text.toLocaleLowerCase());
    // 设置响应头
    res.type('svg');
    res.status(200).send(capture.data);
}

//路由
exports.routerController = (req, res) => {
    let bool = true
    let sendArr = []
    db.query(routerSql, (err, data) => {
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length == 0){
            bool = false
            res.st('没有路由信息','',0)
            return
        }else{
            data.forEach( (item,index) => {
                item.key = item.path || item.icon
                db.query( routerChildSql, item.router_id, (err, data1) => {
                    if(err){
                        bool = false
                        res.st(err,'',0)
                        return
                    }
                    data1.forEach( item1 => {
                        item1.key = item1.path || item1.icon
                    })
                    item.children = data1
                    if(bool && index == data.length - 1){
                        res.st('路由列表', data, 1, data.length)
                    }
                })
            });
        }
        // res.st('路由列表', data, 1, data.length)
    })
}


//验证码
function verifyController (req, res) {

    const { capture } = req.body;
    const cap = req.session.capture;
    if (capture.toLowerCase() != cap) {
        return false
        // res.st('随机验证码验证失败', '', 0)
    }else{
        req.session.capture = 'already ok'
        return true
    }
    
}

exports.aaaController = (req, res) => {
    // //console.log(req.user);
    res.st('aaa','',1)
}