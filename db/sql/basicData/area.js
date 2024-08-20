//获取所有库区
exports.allArea = `select * from base_area where status = 1 order by create_time desc`

//分页查询所有库区-无status
exports.areaByParams = `select a.*, b.store_name from base_area a join base_store b on a.store_id = b.store_id where `
exports.areaByParamsTotal = `select Count(*) as total from base_area a where `
//分页查询所有库区-有status
// exports.areaByParams = `select * from base_area where `
// exports.areaByParamsTotal = `select Count(*) as total from base_area where `

//查询是否存在同名库区
exports.areaNames = 'select area_name from base_area where status != -1'
//查询是否存在同库区编码库区
exports.areaInsert = `insert into base_area set ?`

//通过id查询库区
exports.areaById = `select * from base_area where area_id = ? and status = 1`

//通过删除库区
exports.delAreaById = `update base_area set status = -1 WHERE area_id = ? and status = 1 or status =0`

//通过id更新库区
exports.updateAreaById = `update base_area set ? WHERE area_id = ? and status = 1`

// 通过store_id查询库区信息
exports.getAreaByStoreId = `select * from base_area where store_id = ? and status = 1`

