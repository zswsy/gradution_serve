const db = require('../../db/index')
const { genOrderCode } = require('../../utils/index')

//入库
const {
    genOrderNo, insertMaterialToOrderDetail, updateOrderStatus,
    saveToStorage, insertLog, getOrderListByParamsSql,
    getOrderListDetail, delOrder, getOrderByIdSql
} = require('../../db/sql/materialManager/inStorage')

//初始化
const {
    insertData
} = require('../../db/sql/materialManager/init')

//物料入库
exports.inStorage = (req, res) => {
    try {
        let bool = true
        let {
            orderId,
            status,
            tableData
        } = req.body
        tableData.forEach((item, index) => {
            let param1 = {
                order_id : orderId,
                store_id : item.storeId,
                area_id : item.areaId,
                location_id : item.locationId,
                material_id : item.materialId,
                stock_num : item.stockNum,
                project_id : item.projectId,
                supplier_id : item.supplierId,
                type : 1,
                status : status,
                operate_id: Number(req.user.user_id),
                create_time: new Date().getTime(),
                remark: item.remark
            }
            db.query(insertMaterialToOrderDetail, param1, (err, data) => {
                if(err) {
                    bool = false
                    res.st(err, '入库失败', 0)
                    return
                }
                if(data.affectedRows !== 1) {
                    bool = false
                    res.st('入库失败', '', 0)
                    return
                }
                if(!(status == 0)){
                    //提交
                    let param2 = {
                        material_id : item.materialId,
                        stock_num : Number(item.stockNum),
                        store_id : item.storeId,
                        area_id : item.areaId,
                        location_id : item.locationId,
                    }
                    db.query(insertData, param2, (err, data) => {
                        if(err) {
                            bool = false
                            res.st(err, '物料数量入库失败', 0)
                            return
                        }
                        if(data.affectedRows !== 1) {
                            bool = false
                            res.st('物料数量入库失败', '', 0)
                            return
                        }
                        let logParam = {
                            order_id: orderId,
                            material_id : item.materialId,
                            stock_num : Number(item.stockNum),
                            store_id : item.storeId,
                            area_id : item.areaId,
                            location_id : item.locationId,
                            type: 1,
                            create_time: new Date().getTime(),
                        }
                        db.query(insertLog, logParam, (err, data) => {})
                        if(bool && index === tableData.length - 1) {
                            db.query(updateOrderStatus, [status, orderId], (err, data) => {
                                if(err) {
                                    bool = false
                                    res.st(err, '入库订单状态失败', 0)
                                    return
                                }
                                if(data.affectedRows !== 1) {
                                    bool = false
                                    res.st('入库订单状态失败失败', '', 0)
                                    return
                                }
                            })
                            res.st('物料入库成功', '', 1)
                        }
                    })
                    
                    
                }else{
                    //保存
                    if(bool && index === tableData.length - 1) {
                        db.query(updateOrderStatus, [status, orderId], (err, data) => {
                            if(err) {
                                bool = false
                                res.st('订单状态失败', err, 0)
                                return
                            }
                            if(data.affectedRows !== 1) {
                                bool = false
                                res.st('订单状态失败失败', '', 0)
                                return
                            }
                        })
                        res.st('物料保存成功', '', 1)
                    }
                    
                }
            })

        })
    } catch (error) {
        //console.log(error,'error');
    }
    
}

//物料保存编辑入库
exports.saveToStorage = (req, res) => {
    let bool = true
    let {
        orderId,
        orderNum,
        tableData,
        status
    } = req.body
    
    db.query(saveToStorage, orderId, (err, data) => {
        if(err) {
            bool = false
            res.st('原订单详情删除失败', err, 0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('原订单详情删除失败', '', 0)
            return
        }
    })
    tableData.forEach((item, index) => {
        let param1 = {
            order_id : orderId,
            store_id : item.storeId,
            area_id : item.areaId,
            location_id : item.locationId,
            material_id : item.materialId,
            stock_num : item.stockNum,
            project_id : item.projectId,
            supplier_id : item.supplierId,
            type : 1,
            status : status,
            operate_id: Number(req.user.user_id),
            create_time: new Date().getTime(),
            remark: item.remark
        }
        db.query(insertMaterialToOrderDetail, param1, (err, data) => {
            if(err) {
                bool = false
                res.st('入库失败', err, 0)
                return
            }
            if(data.affectedRows !== 1) {
                bool = false
                res.st('入库失败', '数据添加失败', 0)
                return
            }
            if(!(status == 0)){
                //提交
                let param2 = {
                    material_id : item.materialId,
                    stock_num : Number(item.stockNum),
                    store_id : item.storeId,
                    area_id : item.areaId,
                    location_id : item.locationId,
                }
                db.query(insertData, param2, (err, data) => {
                    if(err) {
                        bool = false
                        res.st('物料数量入库失败', err, 0)
                        return
                    }
                    if(data.affectedRows !== 1) {
                        bool = false
                        res.st('物料数量入库失败', '', 0)
                        return
                    }
                    let logParam = {
                        order_id: orderId,
                        material_id : item.materialId,
                        stock_num : Number(item.stockNum),
                        store_id : item.storeId,
                        area_id : item.areaId,
                        location_id : item.locationId,
                        type: 1,
                        create_time: new Date().getTime(),
                    }
                    db.query(insertLog, logParam, (err, data) => {})
                    if(bool && index === tableData.length - 1) {
                        db.query(updateOrderStatus, [status, orderId], (err, data) => {
                            if(err) {
                                bool = false
                                res.st('订单状态失败', err, 0)
                                return
                            }
                            if(data.affectedRows !== 1) {
                                bool = false
                                res.st('订单状态失败失败', '', 0)
                                return
                            }
                        })
                        res.st('物料入库成功', '', 1)
                    }
                })
            }else{
                //保存
                if(bool && index === tableData.length - 1) {
                    db.query(updateOrderStatus, [status, orderId], (err, data) => {
                        if(err) {
                            bool = false
                            res.st('订单状态失败', err, 0)
                            return
                        }
                        if(data.affectedRows !== 1) {
                            bool = false
                            res.st('订单状态失败失败', '', 0)
                            return
                        }
                    })
                    res.st('物料保存成功', '', 1)
                }
                
            }
        })

    })
}

//订单编号生成
exports.getOrderNo = (req, res) => {
    let bool = true
    let { type } = req.query
    let mapObj = {
        'CSH':0,
        'CGRK':1,
        'CGCK':2,
        '0':'初始化',
        '1':'常规入库',
        '2':'常规出库',
    }
    if(!['CSH', 'CGRK', 'CGCK'].includes(type)) return res.st('参数错误,请输入订单类型', null, 0)
    let params = {
        order_num:genOrderCode(type),
        type:Number(mapObj[type]),
        status:-1,
        operate_id:Number(req.user.user_id),
        create_time:new Date().getTime(),
        remark:mapObj[mapObj[type]],
    }
    db.query(genOrderNo, params, (err, data) => {
        if (err) {
            bool = false
            res.st(err, null, -1)
        }
        if(data.affectedRows != 1) {
            bool = false
            res.st('订单插入数据库失败', null, 0)
            return 
        }
        if(bool) {
            res.st('订单号生成成功', {
                orderNum:params.order_num,
                orderId: data.insertId,
            } , 1)
        }
    })
}

//获取订单列表分页
exports.getOrderListByParams = (req, res) => {
    try {
        let bool = true
    let { orderNum,  type, status, pageSize, pageIndex } = req.body
    let listStr=getOrderListByParamsSql
    if(orderNum){
        listStr+=` and order_num like '%${orderNum}%'` 
    }
    
    listStr+=` and type = ${type}`
    
    if(!status){
        listStr+=` and status != -1`
    }else{
        listStr+=` and status = ${status}`
    }
    if(pageSize && pageIndex){
        listStr+=` limit ${pageSize} offset  ${(pageIndex-1)*pageSize}`
    }
    let tempStr = listStr.replace(/where and/g, 'where')
    db.query(tempStr, (err, data) => {
        if(err){
            bool = false
            res.st(err, null, 0)
            return
        }
        if(data.length == 0){
            bool = false
            res.st('暂无订单数据', [], 1)
        }else{
            let tempArr =[]
            data.forEach((item, index) => {
                db.query(getOrderListDetail,item.order_id, (err, dataL) => {
                    if(err){
                        bool = false
                        res.st(err, null, 0)
                        return
                    }
                    tempArr.push({
                        ...item,
                        orderDetail:dataL
                    })
                    if(bool && index == data.length-1){
                        res.st('订单列表获取成功', tempArr, 1, tempArr.length)
                    }
                })
                
            });
        }
        
    })
    } catch (error) {
        //console.log(error, 'error');
    }

}

//删除出入库单订单
exports.deleteOrder = (req, res) => {
    try {
        let bool = true
        let ids = req.body.ids
        ids.forEach((item, index) => {
            db.query(delOrder,item,(err,data)=>{
                if(err) {
                    bool = false
                    res.st(err,'',0)
                    return
                }
                if(data.affectedRows == 0) {
                    bool = false
                    return res.st('删除订单失败或订单不存在','',0)
                }
                if(bool && index == ids.length -1) res.st('删除订单成功','',1)
            })
        })
    } catch (error) {
        //console.log(error, 'error');
    }
}

//id查出入库单订单
exports.getOrderById = (req, res) => {
    let bool = true
    let id = req.body.id
    db.query(getOrderByIdSql,id,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length == 0) {
            bool = false
            return res.st('订单已删除或订单不存在','',0)
        }
        let tempArr = []
        db.query(getOrderListDetail,data[0].order_id, (err, dataL) => {
            if(err){
                bool = false
                res.st(err, null, 0)
                return
            }
            tempArr.push({
                ...data[0],
                orderDetail:dataL
            })
            if(bool){
                res.st('订单列表获取成功', tempArr, 1, tempArr.length)
            }
        })
    })
    
}
