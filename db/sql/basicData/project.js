//获取所有工程
exports.allProject = `select * from base_project where status = 1 order by create_time desc`

//分页查询所有工程-无status
exports.projectByParams = `select * from base_project where status != -1 and (project_code like ? or project_name like ?) order by create_time desc limit ? offset ?`
exports.projectByParamsTotal = `select Count(*) as total from base_project where status != -1 and (project_code like ? or project_name like ?)`
//分页查询所有工程-有status
exports.projectByParams_s = `select * from base_project where status = ? and (project_code like ? or project_name like ?) order by create_time desc limit ? offset ?`
exports.projectByParamsTotal_s = `select Count(*) as total from base_project where status = ? and (project_code like ? or project_name like ?)`

//查询是否存在同名工程
exports.projectNames = 'select project_name from base_project where status != -1'
//查询是否存在同工程编码工程
exports.projectInsert = `insert into base_project set ?`

//通过id查询工程
exports.projectById = `select * from base_project where project_id = ? and status = 1`

//通过删除工程
exports.delProjectById = `update base_project set status = -1 WHERE project_id = ? and status = 1 or status =0`

//通过id更新工程
exports.updateProjectById = `update base_project set ? WHERE project_id = ? and status = 1`

