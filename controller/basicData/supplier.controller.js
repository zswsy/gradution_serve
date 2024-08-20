const db = require('../../db/index')
const { allSupplier, supplierByParams, supplierByParamsTotal,
        supplierInsert, supplierNames, supplierById, 
        delSupplierById, updateSupplierById,
        supplierByParams_s, supplierByParamsTotal_s,
      } = require('../../db/sql/basicData/supplier')
const { genCode } = require('../../utils/index')

//获取所有供应商
exports.getAllSupplier = (req,res) => {
    db.query(allSupplier,(err,data)=>{
        if(err) return res.st(err,'',0)
        res.st('供应商获取成功', data, 1, data.length)
    })
}

//通过筛选条件获取供应商
exports.getSupplierByParams = async (req,res) => {
    const {keyword, status, pageSize, pageIndex} = req.body
    let pageCount = 0
    if(status === ''){
        let params = [`%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(supplierByParamsTotal,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(supplierByParams,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多供应商数据',data,1)
            res.st('供应商数据获取成功',data,1,pageCount)
        })
    }else{
        let params = [status, `%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(supplierByParamsTotal_s,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(supplierByParams_s,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多物料数据',data,1)
            res.st('物料数据获取成功',data,1,pageCount)
        })
    }
}

//新增供应商
exports.addSupplier = async (req,res) => {
    let insertData = req.body.tableData
    let bool = true
    db.query(supplierNames,(err,data)=>{
        if(err) throw new Error(err)
        const names = data.map(item=>item.supplier_name)
        const newData = insertData.filter(item=>!names.includes(item.supplierName))
        const returnData = insertData.filter(item=>names.includes(item.supplierName))
        //console.log(returnData);
        if(newData.length === 0){
            return res.st('暂无可用供应商插入数据中',returnData,0,returnData.length)
        }
        let dataArr = []
        newData.forEach((item,index) => {
            let templateObj = {
                supplier_code: String(genCode('GYS')),
                supplier_name: item.supplierName,
                contact: item.contact,
                tel: item.tel,
                remark: item.remark,
                status: Number(item.status) === 0 ? item.status: 1,
                operate_id: Number(req.user.user_id),
                create_time: Number(new Date().getTime()),
            }
            db.query(supplierInsert,[templateObj],(err,data)=>{
                if(err) {
                    bool=false
                    res.st(err,'',0)
                    return
                }
                if(data.affectedRows === 0) {
                    bool = false
                    res.st('新增供应商失败','',0)
                    return
                }

                    if(bool&&index === newData.length-1){
                        if(returnData.length > 0) res.st('新增供应商成功-但存在失败供应商（数据库中已存在相同名称供应商）',returnData,1,returnData.length)
                        else res.st('新增供应商成功','',1)
                    }
                
            })
            
        });
    })
    
    
    
    
}

//通过id获取供应商
exports.getSupplierById = async (req,res) => {
    let bool = true
    let supplierId = req.query.id
    db.query(supplierById,supplierId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length === 0) {
            bool = false
            res.st('该供应商不存在/（禁用或者删除）','',0)
        }
        data.forEach(item => {
            delete item.operate_id
        })
        if(bool) res.st('获取供应商成功',data,1,data.length)
    })
}

//通过id删除供应商
exports.delSupplierById = async (req,res) => {
    let bool = true
    let supplierId = req.query.id
    db.query(delSupplierById,supplierId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            return res.st('删除供应商失败或供应商不存在','',0)
        }
        if(bool) res.st('删除供应商成功','',1)
    })
}

//更新供应商信息
exports.updateSupplier = async (req,res) => {
    let supplierId = req.body.id
    let bool = true
    let{
        supplierName,
        contact,
        tel,
        remark,
        status,
    } = req.body
    let templateObj = {
        supplier_name: supplierName,
        contact,
        tel,
        remark: remark,
        status: Number(status) === 0 ? status: 1,
        operate_id: Number(req.user.user_id),
        create_time: Number(new Date().getTime()),
    }
    db.query(updateSupplierById,[templateObj,supplierId],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新供应商失败','',0)
            return
        }
        if(bool)res.st('更新供应商成功','',1)
    })
}

//id更新物料状态
exports.updateSupplierStatus = async (req,res) => {
    const {
        id,
        status
    } = req.body
    let bool = true
    let sql = `update base_supplier set status = ? WHERE supplier_id = ?`
    db.query(sql,[status,id],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新供应商状态失败','',0)
            return
        }
        if(bool) res.st('更新供应商状态成功','',1)
    })
}





