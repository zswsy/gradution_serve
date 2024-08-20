//取出对应库位的物料数量进行出库
exports.getOutNum = `select * from stock_material_all where material_id = ? and store_id = ? and area_id = ? and location_id = ? and stock_num != 0`
exports.updateNum = `update stock_material_all set stock_num = ? where stock_id = ?`

//出库订单详情
exports.getOutOrderDetail =` select a.* , b.store_name, c.area_name, d.location_name, e.material_name, e.material_code
                               from stock_order_detail a 
                               join base_store b on a.store_id = b.store_id
                               join base_area c on a.area_id = c.area_id 
                               join base_location d on a.location_id = d.location_id
                               join base_material e on a.material_id = e.material_id
                               where a.order_id = ? and (a.status = 1 or a.status = 0)`

// 在库物料列表
exports.outMaterialList = `SELECT DISTINCT material_id FROM stock_material_all where stock_num > 0`
exports.getMaterialInfo = `select * from base_material where material_id = ?`

// 物料获取所有库位信息
exports.matGetLocs = `select distinct a.location_id, b.store_id, b.store_name, c.area_id, c.area_name, d.location_id, d.location_name
                      from stock_material_all a
                      join base_store b on a.store_id = b.store_id
                      join base_area c on a.area_id = c.area_id
                      join base_location d on a.location_id = d.location_id
                      where material_id = ? and stock_num > 0`

// 物料库位获取库位库存数量
exports.getLocNum = `select sum(stock_num) as stock_num from stock_material_all where store_id = ? and area_id = ? and location_id = ? and material_id = ?`




