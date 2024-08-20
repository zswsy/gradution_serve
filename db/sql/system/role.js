//所有角色
exports.getAllRoles = `select * from sys_role where status = 1`

//角色分页
exports.getRolesByparams = `select * from sys_role limit ? offset ?`
//角色总数
exports.getRolesCount = `select * from sys_role`

//新增角色
exports.addRole = `insert into sys_role set ?`

//修改角色
exports.updateRole = `update sys_role set ? where role_id = ?`

//修改角色状态
exports.updateRoleStatus = `update sys_role set status = ? where role_id = ?`