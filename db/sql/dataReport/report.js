//初始化报表
exports.initReport = `select a.*, g.order_num,b.store_name, c.area_name, d.location_name, e.project_name, f.supplier_name, h.material_name, h.material_code
                      from stock_order_detail a
                      join base_store b on a.store_id = b.store_id
                      join base_area c on a.area_id = c.area_id 
                      join base_location d on a.location_id = d.location_id 
                      join base_project e on e.project_id = a.project_id
                      join base_supplier f on f.supplier_id = a.supplier_id
                      join stock_orders g on g.order_id = a.order_id
                      join base_material h on h.material_id = a.material_id
                      where a.type = 0 and a.status = 1  order by a.create_time desc limit ? offset ?`
//入库报表
exports.inStoReport = `select a.*, g.order_num,b.store_name, c.area_name, d.location_name, e.project_name, f.supplier_name, h.material_name, h.material_code
                      from stock_order_detail a
                      join base_store b on a.store_id = b.store_id
                      join base_area c on a.area_id = c.area_id 
                      join base_location d on a.location_id = d.location_id 
                      join base_project e on e.project_id = a.project_id
                      join base_supplier f on f.supplier_id = a.supplier_id
                      join stock_orders g on g.order_id = a.order_id
                      join base_material h on h.material_id = a.material_id
                      where a.type = 1 and a.status = 1  order by a.create_time desc limit ? offset ?`

//出库报表
exports.outStoReport = `select a.*, g.order_num,b.store_name, c.area_name, d.location_name, h.material_name, h.material_code
                      from stock_order_detail a
                      join base_store b on a.store_id = b.store_id
                      join base_area c on a.area_id = c.area_id 
                      join base_location d on a.location_id = d.location_id 
                      join stock_orders g on g.order_id = a.order_id
                      join base_material h on h.material_id = a.material_id
                      where a.type = 2 and a.status = 1  order by a.create_time desc limit ? offset ?`

//获取数据总量
exports.getTotal = `select * from stock_order_detail where type = ? and status = 1`