const db = require('../../db/index')
const { allStore, storeByParams, storeByParamsTotal,
        storeInsert, storeNames, storeById, 
        delStoreById, updateStoreById,
        storeByParams_s, storeByParamsTotal_s,
      } = require('../../db/sql/basicData/store')
const { genCode } = require('../../utils/index')

//获取所有仓库
exports.getAllStore = (req,res) => {
    db.query(allStore,(err,data)=>{
        if(err) return res.st(err,'',0)
        res.st('仓库获取成功', data, 1, data.length)
    })
}

//通过筛选条件获取仓库
exports.getStoreByParams = async (req,res) => {
    const {keyword, status, pageSize, pageIndex} = req.body
    let pageCount = 0
    if(status === ''){
        let params = [`%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(storeByParamsTotal,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(storeByParams,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多仓库数据',data,1)
            res.st('仓库数据获取成功',data,1,pageCount)
        })
    }else{
        let params = [status, `%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(storeByParamsTotal_s,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(storeByParams_s,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多仓库数据',data,1)
            res.st('仓库数据获取成功',data,1,pageCount)
        })
    }
}

//新增仓库
exports.addStore = async (req,res) => {
    let insertData = req.body.tableData
    let bool = true
    db.query(storeNames,(err,data)=>{
        if(err) throw new Error(err)
        const names = data.map(item=>item.store_name)
        const newData = insertData.filter(item=>!names.includes(item.storeName))
        const returnData = insertData.filter(item=>names.includes(item.storeName))
        //console.log(returnData);
        if(newData.length === 0){
            return res.st('暂无可用仓库插入数据中',returnData,0,returnData.length)
        }
        let dataArr = []
        newData.forEach((item,index) => {
            let templateObj = {
                store_code: item.storeCode,
                store_name: item.storeName,
                remark: item.remark,
                status: Number(item.status) === 0 ? item.status: 1,
                operate_id: Number(req.user.user_id),
                create_time: Number(new Date().getTime()),
            }
            db.query(storeInsert,[templateObj],(err,data)=>{
                if(err) {
                    bool=false
                    res.st(err,'',0)
                    return
                }
                if(data.affectedRows === 0) {
                    bool = false
                    res.st('新增仓库失败','',0)
                    return
                }

                    if(bool&&index === newData.length-1){
                        if(returnData.length > 0) res.st('新增仓库成功-但存在失败仓库（数据库中已存在相同名称仓库）',returnData,1,returnData.length)
                        else res.st('新增仓库成功','',1)
                    }
                
            })
            
        });
    })
    
    
    
    
}

//通过id获取仓库
exports.getStoreById = async (req,res) => {
    let bool = true
    let storeId = req.query.id
    db.query(storeById,storeId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length === 0) {
            bool = false
            res.st('该仓库不存在/（禁用或者删除）','',0)
        }
        data.forEach(item => {
            delete item.operate_id
        })
        if(bool) res.st('获取仓库成功',data,1,data.length)
    })
}

//通过id删除仓库
exports.delStoreById = async (req,res) => {
    let bool = true
    let storeId = req.query.id
    db.query(delStoreById,storeId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            return res.st('删除仓库失败或仓库不存在','',0)
        }
        if(bool) res.st('删除仓库成功','',1)
    })
}

//更新仓库信息
exports.updateStore = async (req,res) => {
    let storeId = req.body.id
    let bool = true
    let{
        storeName,
        storeCode,
        remark,
        status,
    } = req.body
    let templateObj = {
        store_code: storeCode,
        store_name: storeName,
        remark: remark,
        status: Number(status) === 0 ? status: 1,
        operate_id: Number(req.user.user_id),
        create_time: Number(new Date().getTime()),
    }
    db.query(updateStoreById,[templateObj,storeId],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新仓库失败','',0)
            return
        }
        if(bool)res.st('更新仓库成功','',1)
    })
}

//id更新仓库状态
exports.updateStoreStatus = async (req,res) => {
    const {
        id,
        status
    } = req.body
    let bool = true
    let sql = `update base_store set status = ? WHERE store_id = ?`
    db.query(sql,[status,id],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新仓库状态失败','',0)
            return
        }
        if(bool) res.st('更新仓库状态成功','',1)
    })
}






