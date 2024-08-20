//获取所有仓库
exports.allStore = `select * from base_store where status = 1 order by create_time desc`

//分页查询所有仓库-无status
exports.storeByParams = `select * from base_store where status != -1 and (store_code like ? or store_name like ?) order by create_time desc limit ? offset ?`
exports.storeByParamsTotal = `select Count(*) as total from base_store where status != -1 and (store_code like ? or store_name like ?)`
//分页查询所有仓库-有status
exports.storeByParams_s = `select * from base_store where status = ? and (store_code like ? or store_name like ?) order by create_time desc limit ? offset ?`
exports.storeByParamsTotal_s = `select Count(*) as total from base_store where status = ? and (store_code like ? or store_name like ?)`

//查询是否存在同名仓库
exports.storeNames = 'select store_name from base_store where status != -1'
//查询是否存在同仓库编码仓库
exports.storeInsert = `insert into base_store set ?`

//通过id查询仓库
exports.storeById = `select * from base_store where store_id = ? and status = 1`

//通过删除仓库
exports.delStoreById = `update base_store set status = -1 WHERE store_id = ? and status = 1 or status =0`

//通过id更新仓库
exports.updateStoreById = `update base_store set ? WHERE store_id = ? and status = 1`



