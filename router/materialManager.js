const express = require('express');
const router = express.Router();

//物料初始化
const {
    init, getRestStockNum
} = require('../controller/materialManager/init.controller')

//物料入库
const {
    inStorage, getOrderNo, saveToStorage, getOrderListByParams,
    deleteOrder, getOrderById
} = require('../controller/materialManager/inStorage.controller')

//物料出库
const {
    outStorage, saveEditOut, getOutOrderListByParams, getOutOrderById,
    getOutStoMaterialList, materialGetLocations, getLocationStockNum
} = require('../controller/materialManager/outStorage.controller')

// 所有物料
const { getInStoMaterialList } = require('../controller/materialManager/inStorageStock.controller')

//订单编号
router.get('/orderNo', getOrderNo);//物料单号
//物料初始化
router.post('/init', init);//物料初始化
router.post('/init/list', getOrderListByParams)//入库订单列表
router.post('/init/del', deleteOrder)//删除入库订单
router.post('/init/search', getOrderById)//根据id查询订单详情 
router.post('/location/rest', getRestStockNum);//获取入库库位剩余库存数量

//入库
router.post('/inSto/insert', inStorage);//物料入库
router.post('/inSto/editToSave', saveToStorage);//物料保存再入库
router.post('/inSto/list', getOrderListByParams)//入库订单列表
router.post('/inSto/del', deleteOrder)//删除入库订单
router.post('/inSto/search', getOrderById)//根据id查询订单详情

//出库
router.post('/outSto/out', outStorage);//物料入库
router.post('/outSto/editToSave', saveEditOut);//物料保存再出库
router.post('/outSto/list', getOutOrderListByParams)//出库订单列表
router.post('/outSto/del', deleteOrder)//删除入库订单
router.post('/outSto/search', getOutOrderById)//根据id查询订单详情
router.post('/outSto/material', getOutStoMaterialList)//查询所有在库所有物料种类
router.post('/outSto/matGetLoc', materialGetLocations)//根据物料查询所有库位
router.post('/outSto/matLocGetStocNum', getLocationStockNum)//查询物料库位库存数量

//库内物资
router.post('/inStoStock/material', getInStoMaterialList)//查询所有在库所有物料


module.exports = router;