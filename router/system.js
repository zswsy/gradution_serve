const express = require('express');
const router = express.Router();

//角色
const {
    getAllRole, getRoleByParams, addRole,
    updateRole, updateRoleStatus
} = require('../controller/system/role.controller');

//用户
const {
    getUserPage, addUser, updateUser, updateUserStatus,
    deleteUser
} = require('../controller/system/user.controller');

//角色
router.get('/role/all', getAllRole)
router.post('/role/list', getRoleByParams)
router.post('/role/add', addRole)
router.post('/role/update', updateRole)
router.post('/role/update/status', updateRoleStatus)

//用户
router.post('/user/list', getUserPage)
router.post('/user/add', addUser)
router.post('/user/update', updateUser)
router.post('/user/del', deleteUser)
router.post('/user/update/status', updateUserStatus)


module.exports = router;