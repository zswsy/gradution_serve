const db = require('../../db/index')
const { allLocation, locationByParams, locationByParamsTotal,
        locationInsert, locationNames, locationById, 
        delLocationById, updateLocationById
      } = require('../../db/sql/basicData/location')
const { genCode } = require('../../utils/index')

//获取所有库区
exports.getAllLocation = (req,res) => {
    db.query(allLocation,(err,data)=>{
        if(err) return res.st(err,'',0)
        res.st('库区获取成功', data, 1, data.length)
    })
}

//通过筛选条件获取库区
exports.getLocationByParams = async (req,res) => {
    const {keyword, status, pageSize, pageIndex, storeId, areaId} = req.body
    let pageCount = 0,str =locationByParams, strTotal = locationByParamsTotal
    // sql合成  
    if(!(status === '')) {
        let str5 = `a.status = ${status} `
         str+=str5
         strTotal+=str5
     }else{
        let str5 = `a.status != -1 `
         str+=str5
         strTotal+=str5
     }
    if(keyword) {
       let str1 = `AND (a.location_name LIKE '%${keyword}%' OR a.location_code LIKE' %${keyword}%') `
        str+=str1
        strTotal+=str1
    }
    if(storeId) {
       let  str2 = `AND a.store_id = ${storeId} `
        str+=str2
        strTotal+=str2
    }
    if(areaId) {
        let str3 = `AND a.area_id = ${areaId} `
        str+=str3
        strTotal+=str3
        // strTotal = locationByParamsTotal + str
    }
    if(pageSize && pageIndex) {
        let str4 = `order by a.create_time desc LIMIT ${pageSize} OFFSET ${(pageIndex-1)*pageSize}`
        str += str4
    }
    await db.query(strTotal,[status],async (err,data)=>{
        if(err) return res.st(err,'',0)
        pageCount = data[0].total
        await db.query(str,[status, Number(pageSize), Number((pageIndex-1)*pageSize)],(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多库区数据',data,1)
            res.st('库区数据获取成功',data,1,pageCount)
        })
    })
    
}

//新增库区
exports.addLocation = async (req,res) => {
    let insertData = req.body.tableData
    let bool = true
    db.query(locationNames,(err,data)=>{
        if(err) throw new Error(err)
        const names = data.map(item=>item.location_name)
        const newData = insertData.filter(item=>!names.includes(item.locationName))
        const returnData = insertData.filter(item=>names.includes(item.locationName))
        // //console.log(returnData);
        if(newData.length === 0){
            return res.st('暂无可用库区插入数据中',returnData,0,returnData.length)
        }
        let dataArr = []
        newData.forEach((item,index) => {
            let templateObj = {
                location_code: item.locationCode,
                location_name: item.locationName,
                max_stock_num: item.maxStockNum,
                store_id: Number(item.storeId),
                area_id: Number(item.areaId),
                remark: item.remark,
                status: Number(item.status) === 0 ? item.status: 1,
                operate_id: Number(req.user.user_id),
                create_time: Number(new Date().getTime()),
            }
            db.query(locationInsert,[templateObj],(err,data)=>{
                if(err) {
                    bool=false
                    res.st(err,'',0)
                    return
                }
                if(data.affectedRows === 0) {
                    bool = false
                    res.st('新增库区失败','',0)
                    return
                }

                    if(bool&&index === newData.length-1){
                        if(returnData.length > 0) res.st('新增库区成功-但存在失败库区（数据库中已存在相同名称库区）',returnData,1,returnData.length)
                        else res.st('新增库区成功','',1)
                    }
                
            })
            
        });
    })
    
    
    
    
}

//通过id获取库区
exports.getLocationById = async (req,res) => {
    let bool = true
    let locationId = req.query.id
    db.query(locationById,locationId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length === 0) {
            bool = false
            res.st('该库区不存在/（禁用或者删除）','',0)
        }
        data.forEach(item => {
            delete item.operate_id
        })
        if(bool) res.st('获取库区成功',data,1,data.length)
    })
}

//通过id删除库区
exports.delLocationById = async (req,res) => {
    let bool = true
    let locationId = req.query.id
    db.query(delLocationById,locationId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            return res.st('删除库区失败或库区不存在','',0)
        }
        if(bool) res.st('删除库区成功','',1)
    })
}

//更新库区信息
exports.updateLocation = async (req,res) => {
    let locationId = req.body.id
    let bool = true
    let{
        locationName,
        locationCode,
        maxStockNum,
        storeId,
        areaId,
        remark,
        status,
    } = req.body
    let templateObj = {
        location_code: locationCode,
        location_name: locationName,
        store_id: storeId,
        area_id: areaId,
        max_stock_num: maxStockNum,
        remark: remark,
        status: Number(status) === 0 ? status: 1,
        operate_id: Number(req.user.user_id),
        create_time: Number(new Date().getTime()),
    }
    //console.log(templateObj);
    db.query(updateLocationById,[templateObj,locationId],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新库区失败','',0)
            return
        }
        if(bool)res.st('更新库区成功','',1)
    })
}

//id更新库位状态
exports.updateLocationStatus = async (req,res) => {
    const {
        id,
        status
    } = req.body
    let bool = true
    let sql = `update base_location set status = ? WHERE location_id = ?`
    db.query(sql,[status,id],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新库位状态失败','',0)
            return
        }
        if(bool) res.st('更新库位状态成功','',1)
    })
}

// storeId && areaId 获取库位列表
exports.areaIdGetLocation = async (req,res) => {
    let bool = true
    const {storeId,areaId} = req.body
    let sql = `select * from base_location where store_id = ? and area_id = ? and status = 1`
    db.query(sql,[storeId,areaId],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length == 0) {
            bool = false
            res.st('库位列表为空','',1)
        }
        if(bool) {
            res.st('库位列表',data,1,data.length)
        }
    })
}





