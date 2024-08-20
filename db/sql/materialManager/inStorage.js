//生成订单编号
exports.genOrderNo = `insert into stock_orders set ?`
//修改订单编号状态
exports.updateOrderStatus = `update stock_orders set status = ? where order_id = ?`

//物料插入数据库
exports.insertMaterialToOrderDetail = `insert into stock_order_detail set ?`

//将物料插入到进出库记录log中
exports.insertLog = `insert into stock_log set ?`

//保存后提交
exports.saveToStorage = `update stock_order_detail set status = -1 where order_id = ?`

//根据条件查询数据
exports.getOrderListByParamsSql = `select * from stock_orders where`
exports.getOrderListDetail = ` select a.* , b.store_name, c.area_name, d.location_name, e.project_name, f.supplier_name, g.material_name, g.material_code
                               from stock_order_detail a 
                               join base_store b on a.store_id = b.store_id
                               join base_area c on a.area_id = c.area_id 
                               join base_location d on a.location_id = d.location_id 
                               join base_project e on e.project_id = a.project_id
                               join base_supplier f on f.supplier_id = a.supplier_id
                               join base_material g on g.material_id = a.material_id
                               where a.order_id = ? and a.status = 1 or a.status = 0`

//删除订单列表
exports.delOrder = `update stock_orders set status = -1  where order_id = ?`

//删除订单列表
exports.getOrderByIdSql = `select * from stock_orders where order_id = ? and status != -1`

//查询订单状态是否已经完成
exports.isOrderComplete = `select * from stock_orders where order_id = ? and status = 1`


