const db = require('../../db/index')
const { genOrderCode } = require('../../utils/index')

//入库
const {
    insertMaterialToOrderDetail, insertLog, updateOrderStatus,
    saveToStorage, isOrderComplete, getOrderListByParamsSql,
    getOrderByIdSql
} = require('../../db/sql/materialManager/inStorage')

//出库
const {
    getOutNum, updateNum, getOutOrderDetail, outMaterialList,
    getMaterialInfo, matGetLocs, getLocNum
} = require('../../db/sql/materialManager/outStorage')

//物料出库
exports.outStorage = (req, res) => {
    
    let bool = true
    let {
        orderId,
        status,
        tableData
    } = req.body
    db.query(isOrderComplete, [orderId], (err, data) => {
        if(err) {
            bool = false 
            res.st(err, '', 0)
            return
        }
        if(data.length != 0) {
            bool = false
            res.st('该订单状态已完成', '', 0)
            return
        } else {
            tableData.forEach((item, index) => {
                let param1 = {
                    order_id : orderId,
                    store_id : item.storeId,
                    area_id : item.areaId,
                    location_id : item.locationId,
                    material_id : item.materialId,
                    stock_num : -Number(item.stockNum),
                    type : 2,
                    status : status,
                    operate_id: Number(req.user.user_id),
                    create_time: new Date().getTime(),
                    remark: item.remark
                }
                db.query(insertMaterialToOrderDetail, param1, (err, data) => {
                    if(err) {
                        bool = false
                        res.st(err, '', 0)
                        return
                    }
                    if(data.affectedRows !== 1) {
                        bool = false
                        res.st('出库失败', '数据添加失败', 0)
                        return
                    }
                    if(!(status == 0)){
                        //提交
                        let param2 = {
                            material_id : item.materialId,
                            store_id : item.storeId,
                            area_id : item.areaId,
                            location_id : item.locationId,
                        }
                        db.query(getOutNum, [param2.material_id, param2.store_id, param2.area_id, param2.location_id], (err, data1) => {
                            if(err) {
                                bool = false
                                res.st(err, '', 0)
                                return
                            }
                            if(data1.length == 0 ) {
                                bool = false
                                res.st('数据库中不存在对应物料', '', 0)
                                return
                            }
                            console.log(data1,'data1');
                            let tempArr = data1.map((item) => {
                                return {
                                    [item.stock_id]:item.stock_num
                                }
                            })
                            console.log(tempArr,'tempArr');
                            let tempNum = item.stockNum
                            tempArr.forEach((item1) => {
                                let keys = Object.keys(item1)
                                keys.forEach((key) => {
                                    let pre = JSON.parse(JSON.stringify(item1[key]))
                                    item1[key] = tempNum - item1[key] >= 0 ? 0 : item1[key] - tempNum
                                    tempNum - pre >= 0 ? tempNum = tempNum - pre : tempNum = 0
                                })
                            })
                            console.log(tempArr,'tempArrNew');
                            // return
                            tempArr.forEach((item2,index2) => {
                                let keys = Object.keys(item2)
                                keys.forEach((key) => {
                                    let afterNum = item2[key]
                                    let StockId = Number(key)
                                    db.query(updateNum, [afterNum, StockId], (err, data2) =>{
                                        if(err) {
                                            bool = false
                                            res.st(err, '', 0)
                                            return
                                        }
                                        if(data2.affectedRows == 0 ) {
                                            bool = false
                                            res.st('物料数量更新失败', '', 0)
                                            return
                                        }
                                        if(index2 === tempArr.length - 1){
                                            let logParam = {
                                                order_id: orderId,
                                                material_id : item.materialId,
                                                stock_num : -Number(item.stockNum),
                                                store_id : item.storeId,
                                                area_id : item.areaId,
                                                location_id : item.locationId,
                                                type: 2,
                                                create_time: new Date().getTime(),
                                            }
                                            db.query(insertLog, logParam, (err, data) => {})
                                        }
                                        if(bool && index === tableData.length - 1 && index2 === tempArr.length - 1) {
                                            db.query(updateOrderStatus, [status, orderId], (err, data) => {
                                                if(err) {
                                                    bool = false
                                                    res.st('出库订单状态失败', err, 0)
                                                    return
                                                }
                                                if(data.affectedRows !== 1) {
                                                    bool = false
                                                    res.st('出库订单状态失败失败', '', 0)
                                                    return
                                                }
                                            })
                                            res.st('物料订单出库成功', '', 1)
                                        }
                                    })
                                })
                            })
                            
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

    })
    
}

//物料保存编辑出库
exports.saveEditOut = (req, res) => {
    let bool = true
    let {
        status, 
        orderId, 
        tableData
    } = req.body
    db.query(isOrderComplete, [orderId], (err, data) => {
        if(err) {
            bool = false 
            res.st(err, '', 0)
            return
        }
        if(data.length != 0) {
            bool = false
            res.st('该订单状态已完成', '', 0)
            return
        } else {
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
                tableData.forEach((item, index) => {
                    let param1 = {
                        order_id : orderId,
                        store_id : item.storeId,
                        area_id : item.areaId,
                        location_id : item.locationId,
                        material_id : item.materialId,
                        stock_num : -Number(item.stockNum),
                        type : 2,
                        status : status,
                        operate_id: Number(req.user.user_id),
                        create_time: new Date().getTime(),
                        remark: item.remark
                    }
                    db.query(insertMaterialToOrderDetail, param1, (err, data) => {
                        if(err) {
                            bool = false
                            res.st(err, '', 0)
                            return
                        }
                        if(data.affectedRows !== 1) {
                            bool = false
                            res.st('出库失败', '物料订单详情添加失败', 0)
                            return
                        }
                        if(!(status == 0)){
                            //提交
                            let param2 = {
                                material_id : item.materialId,
                                store_id : item.storeId,
                                area_id : item.areaId,
                                location_id : item.locationId,
                            }
                            db.query(getOutNum, [param2.material_id, param2.store_id, param2.area_id, param2.location_id], (err, data1) => {
                                if(err) {
                                    bool = false
                                    res.st(err, '', 0)
                                    return
                                }
                                if(data1.length == 0 ) {
                                    bool = false
                                    res.st('数据库中不存在对应物料', '', 0)
                                    return
                                }
                                let afterNum = Number(data1[0].stock_num) - Number(item.stockNum)
                                db.query(updateNum, [afterNum, data1[0].stock_id], (err, data2) =>{
                                    if(err) {
                                        bool = false
                                        res.st(err, '', 0)
                                        return
                                    }
                                    if(data2.affectedRows == 0 ) {
                                        bool = false
                                        res.st('物料出库后库存数量更新失败', '', 0)
                                        return
                                    }
                                    let logParam = {
                                        order_id: orderId,
                                        material_id : item.materialId,
                                        stock_num : -Number(item.stockNum),
                                        store_id : item.storeId,
                                        area_id : item.areaId,
                                        location_id : item.locationId,
                                        type: 2,
                                        create_time: new Date().getTime(),
                                    }
                                    db.query(insertLog, logParam, (err, data) => {})
                                    if(bool && index === tableData.length - 1) {
                                        db.query(updateOrderStatus, [status, orderId], (err, data) => {
                                            if(err) {
                                                bool = false
                                                res.st('出库订单状态失败', err, 0)
                                                return
                                            }
                                            if(data.affectedRows !== 1) {
                                                bool = false
                                                res.st('出库订单状态失败失败', '', 0)
                                                return
                                            }
                                        })
                                        res.st('物料订单出库成功', '', 1)
                                    }
                                })
                                
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
            })
        }

    })

}

//获取订单列表分页
exports.getOutOrderListByParams = (req, res) => {
    try {
        let bool = true
        let { orderNum,  type, status, pageSize, pageIndex } = req.body
        let listStr=getOrderListByParamsSql
        if(orderNum){
            listStr+=` and order_num like '%${orderNum}%'` 
        }
        if(type){
            listStr+=` and type = ${type}`
        }
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
                res.st('暂无订单数据', [], 0)
            }else{
                let tempArr =[]
                data.forEach((item, index) => {
                    db.query(getOutOrderDetail,item.order_id, (err, dataL) => {
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

//id查出入库单订单
exports.getOutOrderById = (req, res) => {
    let bool = true
    let id = req.body.id
    db.query(getOrderByIdSql,id,(err,data)=>{
        //console.log(data,'data');
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length == 0) {
            bool = false
            return res.st('订单已删除或订单不存在','',0)
        }else{
            let tempArr = []
            db.query(getOutOrderDetail,data[0].order_id, (err, dataL) => {
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
        }
        // let tempArr = []
        //     db.query(getOutOrderListDetail,data[0].order_id, (err, dataL) => {
        //         if(err){
        //             bool = false
        //             res.st(err, null, 0)
        //             return
        //         }
        //         tempArr.push({
        //             ...data[0],
        //             orderDetail:dataL
        //         })
        //         if(bool){
        //             res.st('订单列表获取成功', tempArr, 1, tempArr.length)
        //         }
        //     })
        
    })
    
}

// 在库物料列表
exports.getOutStoMaterialList = (req, res) => {
    let bool = true
    db.query(outMaterialList,(err, data) =>{
        if(err){
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.length == 0){
            bool = false
            res.st('暂时没有库存数据', '', 1)
            return
        }else{
            let tempArr = []
            data.forEach((item, index) => {
                db.query(getMaterialInfo,item.material_id, (err, dataL) => {
                    if(err){
                        bool = false
                        res.st(err, '', 0)
                        return
                    }
                    tempArr.push({
                        ...dataL[0]
                    })
                    if(index == data.length - 1&&bool){
                        res.st('库存列表获取成功', tempArr, 1, tempArr.length)
                    }
                })

            })
            
        }
    })
}

// 物料获取所有库位信息
exports.materialGetLocations = (req, res) => {
    let bool = true
    const { materialId } = req.body
    db.query(matGetLocs, materialId, (err, data) => {
        if(err){
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.length == 0){
            bool = false
            res.st('暂时没有库位数据', '', 1)
            return
        }else{
            if(bool){
                res.st('库位列表获取成功', data, 1, data.length)
            }
        }
    })

}

// 物料库位获取库位库存数量
exports.getLocationStockNum = (req, res) => {
    let bool = true
    const { storeId, areaId, locationId, materialId } = req.body
    db.query(getLocNum,[storeId, areaId, locationId, materialId], (err, data) => {
        if(err){
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.length == 0){
            bool = false
            res.st('库位暂无该库存数量', '', 1)
            return
        }else{
            if(bool){
                res.st('库存数量获取成功', data[0], 1, data.length)
            }
        }
    })
}


