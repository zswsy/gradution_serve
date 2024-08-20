const db = require('../../db/index')
const { allMaterial, materialByParams, materialByParamsTotal, 
        materialInsert, materialNames, materialById, delMaterialById,
        updateMaterialById, materialByParams_s, materialByParamsTotal_s,
      } = require('../../db/sql/basicData/material')
const { genCode } = require('../../utils/index')

//获取所有物料
exports.getAllMaterial = (req,res) => {
    db.query(allMaterial,(err,data)=>{
        if(err) return res.st(err,'',0)
        res.st('物料获取成功', data, 1, data.length)
    })
}

//通过筛选条件获取物料
exports.getMaterialByParams = async (req,res) => {
    const {keyword, status, pageSize, pageIndex} = req.body
    let pageCount = 0
    if(status === ''){
        let params = [`%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(materialByParamsTotal,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(materialByParams,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多物料数据',data,1)
            res.st('物料数据获取成功',data,1,pageCount)
        })
    }else{
        let params = [status, `%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(materialByParamsTotal_s,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(materialByParams_s,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多物料数据',data,1)
            res.st('物料数据获取成功',data,1,pageCount)
        })
    }
}

//新增物料
exports.addMaterial = async (req,res) => {
    let insertData = req.body.tableData
    let bool = true
    db.query(materialNames,(err,data)=>{
        if(err) throw new Error(err)
        const names = data.map(item=>item.material_name)
        const newData = insertData.filter(item=>!names.includes(item.materialName))
        const returnData = insertData.filter(item=>names.includes(item.materialName))
        if(newData.length === 0){
            return res.st('暂无可用物料插入数据中',returnData,0,returnData.length)
        }
        let dataArr = []
        newData.forEach((item,index)=>{
            let templateObj = {
                material_code: String(genCode('WL')),
                material_name: item.materialName,
                unit: item.unit,
                remark: item.remark,
                status: Number(item.status) === 0 ? item.status: 1,
                operate_id: Number(req.user.user_id),
                create_time: Number(new Date().getTime()),
            }
            dataArr.push(Object.values(templateObj))
            db.query(materialInsert,dataArr,(err,data)=>{
                if(err) {
                    bool = false
                    res.st(err,'',0)
                    return
                }
                if(data.affectedRows === 0) {
                    bool = false
                    res.st('新增物料失败','',0)
                    return
                }

                if(bool&&index === newData.length-1){
                    if(returnData.length > 0) res.st('新增物料成功-但存在失败物料（数据库中已存在相同名称物料）',returnData,1,returnData.length)
                    else res.st('新增物料成功','',1)
                }
                
                
            })
        })
    })
    
}

//通过id获取物料
exports.getMaterialById = async (req,res) => {
    let bool = true
    let materialId = req.query.id
    db.query(materialById,materialId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length === 0) {
            bool = false
            res.st('该物料不存在','',0)
        }
        data.forEach(item => {
            delete item.operate_id
        })
        if(bool) res.st('获取物料成功',data,1,data.length)
    })
}
//通过id删除物料
exports.delMaterialById = async (req,res) => {
    let bool = true
    let materialId = req.query.id
    db.query(delMaterialById,materialId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            return res.st('删除物料失败或物料不存在','',0)
        }
        if(bool) res.st('删除物料成功','',1)
    })
}

//更新物料信息
exports.updateMaterial = async (req,res) => {
    let materialId = req.body.id
    let bool = true
    let{
        materialName,
        unit,
        remark,
        status,
    } = req.body
    let templateObj = {
        material_name: materialName,
        unit: unit,
        remark: remark,
        status: Number(status) === 0 ? status: 1,
        operate_id: Number(req.user.user_id),
        create_time: Number(new Date().getTime()),
    }
    // dataArr.push(Object.values(templateObj))
    db.query(updateMaterialById,[templateObj,materialId],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新物料失败','',0)
            return
        }
        if(bool)res.st('更新物料成功','',1)
    })
}

//id更新物料状态
exports.updateMaterialStatus = async (req,res) => {
    const {
        id,
        status
    } = req.body
    let bool = true
    let sql = `update base_material set status = ? WHERE material_id = ?`
    db.query(sql,[status,id],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新物料状态失败','',0)
            return
        }
        if(bool) res.st('更新物料状态成功','',1)
    })
}
