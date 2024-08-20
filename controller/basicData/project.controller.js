const db = require('../../db/index')
const { allProject, projectByParams, projectByParamsTotal,
        projectInsert, projectNames, projectById, 
        delProjectById, updateProjectById,
        projectByParams_s, projectByParamsTotal_s,
      } = require('../../db/sql/basicData/project')
const { genCode } = require('../../utils/index')

//获取所有工程
exports.getAllProject = (req,res) => {
    db.query(allProject,(err,data)=>{
        if(err) return res.st(err,'',0)
        res.st('工程获取成功', data, 1, data.length)
    })
}

//通过筛选条件获取工程
exports.getProjectByParams = async (req,res) => {
    const {keyword, status, pageSize, pageIndex} = req.body
    let pageCount = 0
    if(status === ''){
        let params = [`%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(projectByParamsTotal,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(projectByParams,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多工程数据',data,1)
            res.st('工程数据获取成功',data,1,pageCount)
        })
    }else{
        let params = [status, `%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((pageIndex-1)*pageSize)]
        await db.query(projectByParamsTotal_s,params,(err,data)=>{
            pageCount = data[0].total
        })
        await db.query(projectByParams_s,params,(err,data)=>{
            if(err) return res.st(err,'',0)
            if(data.length === 0) return res.st('暂无更多工程数据',data,1)
            res.st('工程数据获取成功',data,1,pageCount)
        })
    }
}

//新增工程
exports.addProject = async (req,res) => {
    let insertData = req.body.tableData
    let bool = true
    db.query(projectNames,(err,data)=>{
        if(err) throw new Error(err)
        const names = data.map(item=>item.project_name)
        const newData = insertData.filter(item=>!names.includes(item.projectName))
        const returnData = insertData.filter(item=>names.includes(item.projectName))
        //console.log(returnData);
        if(newData.length === 0){
            return res.st('暂无可用工程插入数据中',returnData,0,returnData.length)
        }
        let dataArr = []
        newData.forEach((item,index) => {
            let templateObj = {
                project_code: String(genCode('GC')),
                project_name: item.projectName,
                contact: item.contact,
                tel: item.tel,
                remark: item.remark,
                status: Number(item.status) === 0 ? item.status: 1,
                operate_id: Number(req.user.user_id),
                create_time: Number(new Date().getTime()),
            }
            db.query(projectInsert,[templateObj],(err,data)=>{
                if(err) {
                    bool=false
                    res.st(err,'',0)
                    return
                }
                if(data.affectedRows === 0) {
                    bool = false
                    res.st('新增工程失败','',0)
                    return
                }

                    if(bool&&index === newData.length-1){
                        if(returnData.length > 0) res.st('新增工程成功-但存在失败工程（数据库中已存在相同名称工程）',returnData,1,returnData.length)
                        else res.st('新增工程成功','',1)
                    }
                
            })
            
        });
    })
    
    
    
    
}

//通过id获取工程
exports.getProjectById = async (req,res) => {
    let bool = true
    let projectId = req.query.id
    db.query(projectById,projectId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.length === 0) {
            bool = false
            res.st('该工程不存在/（禁用或者删除）','',0)
        }
        data.forEach(item => {
            delete item.operate_id
        })
        if(bool) res.st('获取工程成功',data,1,data.length)
    })
}

//通过id删除工程
exports.delProjectById = async (req,res) => {
    let bool = true
    let projectId = req.query.id
    db.query(delProjectById,projectId,(err,data)=>{
        if(err) {
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            return res.st('删除工程失败或工程不存在','',0)
        }
        if(bool) res.st('删除工程成功','',1)
    })
}

//更新工程信息
exports.updateProject = async (req,res) => {
    let projectId = req.body.id
    let bool = true
    let{
        projectName,
        contact,
        tel,
        remark,
        status,
    } = req.body
    let templateObj = {
        project_name: projectName,
        contact,
        tel,
        remark: remark,
        status: Number(status) === 0 ? status: 1,
        operate_id: Number(req.user.user_id),
        create_time: Number(new Date().getTime()),
    }
    //console.log(req.body,'req.body ');
    //console.log(templateObj,'gogncheng ');
    db.query(updateProjectById,[templateObj,projectId],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新工程失败','',0)
            return
        }
        if(bool)res.st('更新工程成功','',1)
    })
}

//id更新工程状态
exports.updateProjectStatus = async (req,res) => {
    const {
        id,
        status
    } = req.body
    let bool = true
    let sql = `update base_project set status = ? WHERE project_id = ?`
    db.query(sql,[status,id],(err,data)=>{
        if(err){
            bool = false
            res.st(err,'',0)
            return
        }
        if(data.affectedRows == 0) {
            bool = false
            res.st('更新工程状态失败','',0)
            return
        }
        if(bool) res.st('更新工程状态成功','',1)
    })
}



