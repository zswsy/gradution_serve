const express = require('express');
const router = express.Router();

//物料controller
const { getAllMaterial, getMaterialByParams, addMaterial,
        getMaterialById, delMaterialById, updateMaterial,
        updateMaterialStatus 
    } = require('../controller/basicData/material.controller');
    
//供应商controller    
const { getAllSupplier, getSupplierByParams, addSupplier,
        getSupplierById, delSupplierById, updateSupplier,
        updateSupplierStatus
    } = require('../controller/basicData/supplier.controller');

//工程controller    
const { getAllProject, getProjectByParams, addProject,
        getProjectById, delProjectById, updateProject,
        updateProjectStatus
    } = require('../controller/basicData/project.controller');

//仓库controller    
const { getAllStore, getStoreByParams, addStore,
        getStoreById, delStoreById, updateStore,
        updateStoreStatus
    } = require('../controller/basicData/store.controller');

//库区controller    
const { getAllArea, getAreaByParams, addArea,
        getAreaById, delAreaById, updateArea,
        updateAreaStatus, storeIdGetArea
    } = require('../controller/basicData/area.controller');

//库位controller    
const { getAllLocation, getLocationByParams, addLocation,
        getLocationById, delLocationById, updateLocation,
        updateLocationStatus, areaIdGetLocation
    } = require('../controller/basicData/location.controller');




//基础数据--物料路由
router.get('/material/all', getAllMaterial);//获取所有物料
router.post('/material/select', getMaterialByParams);//分页查询+条件查询
router.post('/material/add', addMaterial);//物料新增
router.get('/material/search', getMaterialById);//通过id查询物料
router.delete('/material/delete', delMaterialById);//通过id删除物料
router.post('/material/update', updateMaterial);//通过id更新物料
router.post('/material/status', updateMaterialStatus);//通过id更新物料状态-------new

//基础数据--供应商路由
router.get('/supplier/all', getAllSupplier);//获取所有供应商
router.post('/supplier/select', getSupplierByParams);//分页查询+条件查询
router.post('/supplier/add', addSupplier);//供应商新增
router.get('/supplier/search', getSupplierById);//通过id查询物料
router.delete('/supplier/delete', delSupplierById);//通过id删除物料
router.post('/supplier/update', updateSupplier);//通过id更新物料
router.post('/supplier/status', updateSupplierStatus);//通过id更新物料状态-------new

//基础数据--工程路由
router.get('/project/all', getAllProject);//获取所有工程
router.post('/project/select', getProjectByParams);//分页查询+条件查询
router.post('/project/add', addProject);//工程新增
router.get('/project/search', getProjectById);//通过id查询物料
router.delete('/project/delete', delProjectById);//通过id删除物料
router.post('/project/update', updateProject);//通过id更新物料
router.post('/project/status', updateProjectStatus);//通过id更新物料

//基础数据--仓库路由
router.get('/store/all', getAllStore);//获取所有供应商
router.post('/store/select', getStoreByParams);//分页查询+条件查询
router.post('/store/add', addStore);//供应商新增
router.get('/store/search', getStoreById);//通过id查询物料
router.delete('/store/delete', delStoreById);//通过id删除物料
router.post('/store/update', updateStore);//通过id更新物料
router.post('/store/status', updateStoreStatus);//通过id更新物料

//基础数据--库区路由
router.get('/area/all', getAllArea);//获取所有供应商
router.post('/area/select', getAreaByParams);//分页查询+条件查询
router.post('/area/add', addArea);//供应商新增
router.get('/area/search', getAreaById);//通过id查询物料
router.delete('/area/delete', delAreaById);//通过id删除物料
router.post('/area/update', updateArea);//通过id更新物料
router.post('/area/status', updateAreaStatus);//通过id更新物料
router.post('/area/storeId', storeIdGetArea);//通过id更新物料

//基础数据--库位路由
router.get('/location/all', getAllLocation);//获取所有供应商
router.post('/location/select', getLocationByParams);//分页查询+条件查询
router.post('/location/add', addLocation);//供应商新增
router.get('/location/search', getLocationById);//通过id查询物料
router.delete('/location/delete', delLocationById);//通过id删除物料
router.post('/location/update', updateLocation);//通过id更新物料
router.post('/location/status', updateLocationStatus);//通过id更新物料
router.post('/location/areaId', areaIdGetLocation);//通过id更新物料

module.exports = router;