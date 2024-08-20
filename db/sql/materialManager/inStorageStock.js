// 获取所有在库物料列表
exports.getAllMaterial = `select distinct a.material_id, sum(a.stock_num) as stock_num, b.material_name, b.material_code
                          from stock_material_all a
                          join base_material b on a.material_id = b.material_id
                          where a.stock_num != 0 and (b.material_name like ? or b.material_code like ?) 
                          group by a.material_id
                          limit ? offset ?`

// 获取所有在库物料列表总数
exports.getAllMaterialTotal = `select distinct a.material_id,b.material_name, b.material_code
                               from stock_material_all a
                               join base_material b on a.material_id = b.material_id
                               where a.stock_num != 0 and (b.material_name like ? or b.material_code like ?)`

// 物料id获取详细库存数据
exports.getlocationDetail = `select distinct a.location_id, sum(a.stock_num) as stock_num, b.store_name, b.store_id, c.area_name, c.area_id, d.location_name
                             from stock_material_all a
                             join base_store b on a.store_id = b.store_id
                             join base_area c on a.area_id = c.area_id
                             join base_location d on a.location_id = d.location_id
                             where a.material_id = ?
                             group by a.location_id, b.store_name, b.store_id, c.area_name, c.area_id, d.location_name`

