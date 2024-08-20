const db = require('../../db/index')

const {
    insertData, getDataBylocationId
} = require('../../db/sql/materialManager/init')

const {
    locationById
} = require('../../db/sql/basicData/location')

//入库
const {
    insertLog, insertMaterialToOrderDetail, updateOrderStatus,
    getOrderByIdSql, getOrderListDetail, delOrder
} = require('../../db/sql/materialManager/inStorage')

//初始化物料
exports.init = (req, res) => {
    //console.log(req.body);
    const {
        orderId,
        tableData
    } = req.body
    let bool = true
    tableData.forEach(async (item,index) => {
        let templateObj = {
            location_id: item.locationId,
            store_id: item.storeId,
            area_id: item.areaId,
            material_id: item.materialId,
            stock_num: item.stockNum,
        }
        db.query(insertData, templateObj, async (err, data) => {
            if (err) {
                bool = false
                res.st(err, '', 0)
                return
            }
            if (data.affectedRows === 0) {
                bool = false
                res.st('物料初始化失败', '', 0)
                return
            }
            let param1 = {
                order_id : orderId,
                store_id : item.storeId,
                area_id : item.areaId,
                location_id : item.locationId,
                material_id : item.materialId,
                stock_num : item.stockNum,
                project_id : item.projectId || 0,
                supplier_id : item.supplierId || 0,
                type : 0,
                status : 1,
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
            })
            let logParam = {
                order_id: orderId,
                material_id : item.materialId,
                stock_num : Number(item.stockNum),
                store_id : item.storeId,
                area_id : item.areaId,
                location_id : item.locationId,
                type: 0,
                create_time: new Date().getTime(),
            }
            db.query(insertLog, logParam, (err, data) => {})
            if (bool && index === tableData.length - 1) {
                db.query(updateOrderStatus, [1, orderId], (err, data) => {
                    if(err) {
                        bool = false
                        res.st(err, '初始化入库订单状态失败', 0)
                        return
                    }
                    if(data.affectedRows !== 1) {
                        bool = false
                        res.st('初始化入库订单状态失败失败', '', 0)
                        return
                    }
                })
                res.st('物料初始化成功', '', 1)
            }
        })
    })

}

//查看库位剩余库存容量
exports.getRestStockNum = async(req, res) => {
    const { locationId, storeId, areaId} = req.body
    let bool = true
    let maxNum = 0, restNum = 0, stockNum = 0
    await db.query(locationById, locationId, async (err, Ldata) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        if(Ldata.length === 0){
            bool = false
            res.st('库位数据不存在', '', 0)
        }else{
            maxNum = Ldata[0].max_stock_num
        }
        db.query(getDataBylocationId, [storeId, areaId, locationId], async (err, data) => {
            if (err) {
                bool = false
                res.st(err, '', 0)
                return
            }
            if(data.length === 0){
                restNum = Number(maxNum) - Number(stockNum)
                let locationData = {
                    maxNum,
                    restNum,
                    stockNum
                }
                if(bool)return res.st('库位数获取成功', locationData, 1)
            }else{
                data.forEach(item => {
                    stockNum += Number(item.stock_num)
                })
                restNum = Number(maxNum) - Number(stockNum)
                let locationData = {
                    maxNum,
                    restNum,
                    stockNum
                }
                if(bool)return res.st('库位数获取成功', locationData, 1)
            }
        })
        
    })
    
}

//删除出入库单订单
exports.deleteOrder = (req, res) => {
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
            if(bool) res.st('删除订单成功','',1)
        })
    })
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