exports.insertData = `insert into stock_material_all set ?`
exports.getDataBylocationId = `select stock_num from stock_material_all where store_id = ? and area_id = ? and location_id = ?`