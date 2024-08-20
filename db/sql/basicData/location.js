//获取所有库区
exports.allLocation = `select * from base_location where status = 1 order by create_time desc`

//分页查询所有库区
exports.locationByParams = `select a.*,b.store_name,c.area_name 
                            from base_location a 
                            join base_store b on a.store_id = b.store_id 
                            join base_area c on a.area_id = c.area_id  
                            where `
exports.locationByParamsTotal = `select Count(*) as total from base_location a where `

//查询是否存在同名库区
exports.locationNames = 'select location_name from base_location where status != -1'
//查询是否存在同库区编码库区
exports.locationInsert = `insert into base_location set ?`

//通过id查询库区
exports.locationById = `select * from base_location where location_id = ? and status = 1`

//通过删除库区
exports.delLocationById = `update base_location set status = -1 WHERE location_id = ? and status = 1 or status =0`

//通过id更新库区
exports.updateLocationById = `update base_location set ? WHERE location_id = ? and status = 1`

