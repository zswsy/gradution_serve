const express = require('express');
const router = express.Router();

// 报表初始化
const {
    initReport, inStoReport, outStoReport
} = require('../controller/dataReport/report.controller');

//初始化报表
router.post('/init', initReport)
router.post('/inSto', inStoReport)
router.post('/outSto', outStoReport)


module.exports = router;