exports.PORT  = 3916;

exports.SQLCONFIG = {
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: 'zswsy159753',
    database: 'shangrao_wms',
};

//加密盐length
exports.BCRYPTJSSECRETKEY=10

//token的解密配置
exports.TOKENSCORETKEY='SHANGRAO_WMS'
exports.EXPIRESIN='7d' //过期时间为30天


exports.SESSIONCONFIG = {
    secret: 'SHANGRAO_WMS', // 用于签名 session ID 的密钥
    resave: false,
    saveUninitialized: true
}