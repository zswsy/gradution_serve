//获取所有物料
exports.allMaterial = `select * from base_material where status = 1 order by create_time desc`

//分页查询所有物料-无status
exports.materialByParams = `select * from base_material where status != -1 and (material_code like ? or material_name like ?) order by create_time desc limit ? offset ?`
exports.materialByParamsTotal = `select Count(*) as total from base_material where status != -1  and (material_code like ? or material_name like ?)`
//分页查询所有物料-有status
exports.materialByParams_s = `select * from base_material where status = ? and (material_code like ? or material_name like ?) order by create_time desc limit ? offset ?`
exports.materialByParamsTotal_s = `select Count(*) as total from base_material where status = ?  and (material_code like ? or material_name like ?)`

//查询是否存在同名物料
exports.materialNames = 'select material_name from base_material where status != -1'
//查询是否存在同物料编码物料
exports.materialInsert = `insert into base_material (material_code,material_name,unit,remark,status,operate_id,create_time) values (?) `

//通过id查询物料
exports.materialById = `select * from base_material where material_id = ? and status = 1`

//通过删除物料
exports.delMaterialById = `update base_material set status = -1 WHERE material_id = ? and status = 1 or status =0`

//通过id更新物料
exports.updateMaterialById = `update base_material set ? WHERE material_id = ? and status = 1`










