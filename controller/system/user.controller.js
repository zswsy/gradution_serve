const db = require('../../db/index');

//加密
const bcryptjs = require('bcryptjs')
const { BCRYPTJSSECRETKEY } = require('../../config')

const {
    getUserByParams, getAllUser, addUser, getUserByName,
    updateUser, updateUserStatus, delUser
} = require('../../db/sql/system/user');
const e = require('express');

//获取用户分页
exports.getUserPage = async (req, res) => {
    let bool = true
    let {
        pageSize,
        pageIndex
    } = req.body
    db.query(getUserByParams, [Number(pageSize),Number((pageIndex - 1) * pageSize)], (err, data) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        if(bool) {
            db.query(getAllUser, (err, data1) => {
                if (err) {
                    bool = false
                    res.st(err, '', 0)
                    return
                }
                if(bool){
                    data.forEach(e => {
                        delete e.password;
                        e.permission = JSON.parse(e.permission)
                        e.sexLabel = e.sex == 2 ? '未知' : e.sex == 1 ? '男' : '女'
                    });
                    res.st('获取用户数据成功', data, 1, data1.length)
                }
            })
            
        }
    })
}

//新增用户
exports.addUser = async (req, res) => {
    let bool = true
    let {
        userName,
        password,
        role,
        permission,
        sex,
        status,
        mobile,
    } = req.body
    let params = {
        username:userName,
        userAccount:userName,
        password:bcryptjs.hashSync(password,BCRYPTJSSECRETKEY),
        role:role,
        sex,
        permission:JSON.stringify(permission),
        status:Number(status),
        mobile:mobile,
        create_time: new Date().getTime(),
    }
    // console.log(params,'useradd');
    db.query(getUserByName,userName,(err, dataName) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
            return
        }
        if(dataName.length > 0){
            bool = false
            res.st('用户名已存在,请重新选择', '', 0)
            return
        }else{
            db.query(addUser, params, (err, data) => {
                if (err) {
                    bool = false
                    res.st(err, '', 0)
                    return
                }
                if(data.affectedRows != 1){
                    bool = false
                    res.st('新增用户失败', '', 0)
                }
                if(bool){
                    res.st('新增用户成功', '', 1)
                }
            })
        }
    })
}

//修改用户
exports.updateUser = async (req, res) => {
    let bool = true
    let {
        userId,
        userName,
        password,
        role,
        permission,
        sex,
        status,
        mobile,
    } = req.body
    let params = {
        username:userName,
        userAccount:userName,
        role:role,
        sex,
        permission:JSON.stringify(permission),
        status:Number(status),
        mobile:mobile,
        create_time: new Date().getTime(),
    }
    if(password){
        params.password = bcryptjs.hashSync(password,BCRYPTJSSECRETKEY)
    }
    db.query(updateUser, [params, userId], (err, data) => {
        if(err){
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.affectedRows != 1){
            bool = false
            res.st('修改用户失败', '', 0)
            return
        }
        if(bool){
            res.st('修改用户成功', '', 1)
        }
    })
}

//修改用户状态
exports.updateUserStatus = async (req, res) => {
    let bool = true
    let {
        status,
        userId
    } = req.body
    db.query(updateUserStatus, [Number(status), userId], (err, data) => {
        if(err){
            bool = false
            res.st(err, '', 0)
            return
        }
        if (data.affectedRows != 1) {
            bool = false
            res.st('修改用户状态失败', '', 0)
            return
        }
        if(bool){
            res.st('修改用户状态成功', '', 1)
        }
    })
}

// 删除用户
exports.deleteUser = async (req, res) => {
    let bool = true
    const { id } = req.body
    db.query(delUser, id, (err, data) => {
        if(err){
            bool = false
            res.st(err, '', 0)
            return
        }
        if(data.affectedRows != 1){
            bool = false
            res.st('删除用户失败', '', 0)
        }
        if(bool){
            res.st('删除用户成功', '', 1)
        }
    })
}
