const express = require('express');
const { PORT, TOKENSCORETKEY, SESSIONCONFIG } = require('./config');
const { errorHandle } = require('./middleware/index');
const app = express();
const session = require('express-session');
const { sendTemplate } = require('./middleware/index');

//路由引用
const appBasicRouter = require('./router/appBasic');
const basicDataRouter = require('./router/basicData');
const materialManagerRouter = require('./router/materialManager');
const dataReportRouter = require('./router/dataReport');
const systemRouter = require('./router/system');


//全局消息发送中间件注册
app.use( (req,res,next)=>{
    res.st=(err, data, status, total)=>{
        sendTemplate(res, err, data, status, total);
    };
    next()
})



//允许跨域配置
const cors=require('cors');
app.use(cors());
//session配置
app.use(session({...SESSIONCONFIG}))

//解析token的配置
const expressJwt= require('express-jwt')
app.use(expressJwt({secret: TOKENSCORETKEY}).unless({path:[/^\/capture/,/^\/login/,/^\/ip/,/^\/hello/]}))

//设置接收form表单的数据
const bodyParser = require('body-parser')
app.use(bodyParser.json());	 // 解析 application/json
app.use(bodyParser.urlencoded({extended:true})) // 解析 application/x-www-form-urlencoded


//路由注册
app.use(appBasicRouter)
app.use('/data',basicDataRouter)
app.use('/material',materialManagerRouter)
app.use('/report',dataReportRouter)
app.use('/system',systemRouter)





// 全局的错误中间件
app.use(errorHandle)

app.listen(PORT, ()=> {
    console.log(`\n`)
    console.log(`Server started on port------------- 127.0.0.1:${PORT}`);
})