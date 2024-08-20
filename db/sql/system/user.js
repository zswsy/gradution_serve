//获取用户分页
exports.getUserByParams = `select a.*, b.role_name
                           from sys_user a
                           join sys_role b on a.role = b.role_code
                           where a.status != -1
                           limit ? offset ?`

//获取所有用户
exports.getAllUser = `select * from sys_user where status != -1`

//新增用户
exports.addUser = `insert into sys_user set ?`
//获取同名用户
exports.getUserByName = `select * from sys_user where username = ?`

//更新用户
exports.updateUser = `update sys_user set ? where user_id = ?`

//修改角色状态
exports.updateUserStatus = `update sys_user set status = ? where user_id = ?`

// 删除角色
exports.delUser = `update sys_user set status = -1 where user_id = ?`


