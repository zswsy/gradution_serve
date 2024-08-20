const db = require('../../db/index');

const {
    getAllRoles, getRolesByparams, addRole, 
    updateRole, updateRoleStatus, getRolesCount
} = require('../../db/sql/system/role')

//获取所有角色
exports.getAllRole = async (req, res) => {
    let bool = true
    db.query(getAllRoles, (err, data) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        if(bool) {
            res.st('角色列表获取成功', data, 1, data.length)
        }
    })
}

//获取所有角色-分页
exports.getRoleByParams = async (req, res) => {
    let bool = true
    let {
        pageSize,
        pageIndex
    } = req.body
    db.query(getRolesByparams, [ Number(pageSize), Number((pageIndex-1)*pageSize) ], (err, data) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        db.query(getRolesCount, (err, dataT) => {
            if (err) {
                bool = false
                res.st(err, '', 0)
                return
            }
            if(bool) {
                res.st('角色列表获取成功', data, 1, dataT.length)
            }
        })
        
    })
}

//新增角色
exports.addRole = async (req, res) => {
    let bool = true
    let {
        roleName,
        roleCode,
        status,
        remark,
    } = req.body
    let param = {
        role_name: roleName,
        role_code: roleCode,
        status: Number(status),
        remark: remark,
        create_time: new Date().getTime(),
    }
    db.query(addRole, param, (err, data) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.affectedRows == 0){
            bool = false
            res.st('新增角色失败', '', 0)
            return 
        }
        if(bool){
            res.st('新增角色成功', '', 1)
        }
    })
}

//修改角色
exports.updateRole = async (req, res) => {
    let bool = true
    let {
        roleId,
        roleName,
        roleCode,
        status,
        remark,
    } = req.body
    let param = {
        role_name: roleName,
        role_code: roleCode,
        status: Number(status),
        remark: remark,
        create_time: new Date().getTime(),
    }
    db.query(updateRole, [param, roleId], (err, data) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.affectedRows == 0){
            bool = false
            res.st('修改角色失败', '', 0)
            return 
        }
        if(bool){
            res.st('修改角色成功', '', 1)
        }
    })
}
//修改角色状态
exports.updateRoleStatus = async (req, res) => {
    let bool = true
    let {
        roleId,
        status,
    } = req.body
    db.query(updateRoleStatus, [status, roleId], (err, data) => {
        if (err) {
            bool = false
            res.st(err, '角色状态', 0)
            return
        }
        if(data.affectedRows == 0){
            bool = false
            res.st('修改角色状态失败', '', 0)
            return 
        }
        if(bool){
            res.st('修改角色状态成功', '', 1)
        }
    })
}