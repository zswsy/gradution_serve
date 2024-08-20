const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const expressJoi = require('@escook/express-joi');
const { loginSchema } = require('../schema/appBasic/loginSchema')

const upload=multer({dest:path.join(__dirname,'../uploads')})

//controller
const { loginController, captureController, aaaController, routerController } = require('../controller/appBasic/basic.controller');

//multer需要在expressJoi之前使用
router.post('/login',upload.none(),expressJoi(loginSchema),loginController)
router.get('/capture',captureController)
router.post('/router',routerController)
router.post('/aaa',upload.none(),aaaController)

module.exports = router;