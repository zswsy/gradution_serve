# 插件说明

--- 
body-parser：用于处理JSON数据格式

 // 解析 application/json格式数据
app.use(bodyParser.json());	
// 解析 application/x-www-form-urlencoded格式数据
app.use(bodyParser.urlencoded({extended:true}))
// 解析 muiltiply/form-data 个数数据
const multer = require('multer');
const upload=multer({dest:path.join(__dirname,'../uploads')})
router.post('/login',upload.single('file'),loginController)
---  

--- 
jsonwebtoken: 生成bearer token
express-jwt: 用于解析bearer token
解析出来的数据在req.user中


--- 
svg-captcha： 用于生成验证码

cookie-parser：用于解析cookie数据
---

express-session：用于处理session数据
---