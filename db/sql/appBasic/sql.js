//登录
exports.loginSql=`select * from sys_user where username = ? and status = 1`

// 路由
exports.routerSql=`select * from sys_router where router_id in (1,2,3,4,5)`
// 加载路由子信息
exports.routerChildSql=`select * from sys_router where parent_id = ?`