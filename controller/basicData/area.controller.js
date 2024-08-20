const db = require('../../db/index')
const { allArea, areaByParams, areaByParamsTotal,
        areaInsert, areaNames, areaById, 
        delAreaById, updateAreaById,getAreaByStoreId
      } = require('../../db/sql/basicData/area')
const { genCode } = require('../../utils/index')

//获取所有库区
exports.getAllArea = (req,res) => {
    db.query(allArea,(err,data)=>{
        if(err) return res.st(err,'',0)
        res.st('库区获取成功', data, 1, data.length)
    })
}

//通过筛选条件获取库区
exports.getAreaByParams = async (req,res) => {
    const {keyword, status, pageSize, pageIndex, storeId} = req.body
    let pageCount = 0,str =areaByParams, strTotal = areaByParamsTotal
    // console.log(req.body,status,'status');
    // console.log(Boolean(status === ''),'status');
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
       let str1 = `AND (a.area_name LIKE '%${keyword}%' OR a.area_code LIKE' %${keyword}%') `
        str+=str1
        strTotal+=str1
    }
    if(storeId) {
       let  str2 = `AND a.store_id = ${storeId} `
        str+=str2
        strTotal+=str2
    }
    if(pageSize && pageIndex) {
        let str4 = `order by a.create_time desc LIMIT ${pageSize} OFFSET ${(pageIndex-1)*pageSize}`
        str += str4
    }
    let tempstr,tempstrTotal
    tempstr = str
    tempstrTotal = strTotal
    // console.log(Boolean(status),Boolean(keyword),Boolean(storeId),'boolean');
    // console.log(tempstr,'tempstr');
    // console.log(tempstrTotal,'tempstrTotal');
    await db.query(tempstrTotal,[status],async (err,data)=>{
        if(err) return res.st(err,'',0)
        // //console.log(data,'data');
        if(!data || data.length == 0) pageCount = 0
        else pageCount = data[0].total
        await db.query(tempstr,[status, Number(pageSize), Number((pageIndex-1)*pageSize)],(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多库区数据',data,1)
            res.st('库区数据获取成功',data,1,pageCount)
        })
    })
}

//新增库区
exports.addArea = async (req,res) => {
    let insertData = req.body.tableData
    let bool = true
    db.query(areaNames,(err,data)=>{
        if(err) throw new Error(err)
        const names = data.map(item=>item.area_name)
        const newData = insertData.filter(item=>!names.includes(item.areaName))
        const returnData = insertData.filter(item=>names.includes(item.areaName))
        // //console.log(returnData);
        if(newData.length === 0){
            return res.st('暂无可用库区插入数据中',returnData,0,returnData.length)
        }
        let dataArr = []
        newData.forEach((item,index) => {
            let templateObj = {
                area_code: item.areaCode,
                area_name: item.areaName,
                store_id: Number(item.storeId),
                remark: item.remark,
                status: Number(item.status) === 0 ? item.status: 1,
                operate_id: Number(req.user.user_id),
                create_time: Number(new Date().getTime()),
            }
            db.query(areaInsert,[templateObj],(err,data)=>{
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
exports.getAreaById = async (req,res) => {
    let bool = true
    let areaId = req.query.id
    db.query(areaById,areaId,(err,data)=>{
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
exports.delAreaById = async (req,res) => {
    let bool = true
    let areaId = req.query.id
    db.query(delAreaById,areaId,(err,data)=>{
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
exports.updateArea = async (req,res) => {
    let areaId = req.body.id
    let bool = true
    let{
        areaName,
        areaCode,
        storeId,
        remark,
        status,
    } = req.body
    let templateObj = {
        area_code: areaCode,
        area_name: areaName,
        store_id: storeId,
        remark: remark,
        status: Number(status) === 0 ? status: 1,
        operate_id: Number(req.user.user_id),
        create_time: Number(new Date().getTime()),
    }
    // //console.log(templateObj);
    db.query(updateAreaById,[templateObj,areaId],(err,data)=>{
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

//id更新库区状态
exports.updateAreaStatus = async (req,res) => {
    const {
        id,
        status
    } = req.body
    let bool = true
    let sql = `update base_area set status = ? WHERE area_id = ?`
    db.query(sql,[status,id],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新库区状态失败','',0)
            return
        }
        if(bool) res.st('更新库区状态成功','',1)
    })
}

// storeId 获取库区
exports.storeIdGetArea = async (req,res) => {
    let bool = true
    const storeId = req.body.storeId
    let sql = `select * from base_area where store_id = ? and status = 1`
    db.query(sql,storeId,(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length == 0){
            bool = false
            res.st('该仓库暂无库区','',1)
            return
        }
        if(bool) {
            res.st('获取库区成功',data,1)
        }
    })
}





