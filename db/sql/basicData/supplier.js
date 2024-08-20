//获取所有供应商
exports.allSupplier = `select * from base_supplier where status = 1 order by create_time desc`

//分页查询所有供应商-无status
exports.supplierByParams = `select * from base_supplier where status != -1 and (supplier_code like ? or supplier_name like ?) order by create_time desc limit ? offset ?`
exports.supplierByParamsTotal = `select Count(*) as total from base_supplier where status != -1 and (supplier_code like ? or supplier_name like ?)`
//分页查询所有物料-有status
exports.supplierByParams_s = `select * from base_supplier where status = ? and (supplier_code like ? or supplier_name like ?) order by create_time desc limit ? offset ?`
exports.supplierByParamsTotal_s = `select Count(*) as total from base_supplier where status = ?  and (supplier_code like ? or supplier_name like ?)`

//查询是否存在同名供应商
exports.supplierNames = 'select supplier_name from base_supplier where status != -1'
//查询是否存在同供应商编码供应商
exports.supplierInsert = `insert into base_supplier set ?`

//通过id查询供应商
exports.supplierById = `select * from base_supplier where supplier_id = ? and status = 1`

//通过删除供应商
exports.delSupplierById = `update base_supplier set status = -1 WHERE supplier_id = ? and (status = 1 or status =0)`

//通过id更新供应商
exports.updateSupplierById = `update base_supplier set ? WHERE supplier_id = ? and status = 1`

