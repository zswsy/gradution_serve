const db = require('../../db/index')

const { initReport, inStoReport, outStoReport, getTotal} = require('../../db/sql/dataReport/report')

//获取初始化报表
exports.initReport = async (req, res) => {
    let bool = true
    const {
        pageSize,
        pageIndex,
    } = req.body
    db.query(initReport, [Number(pageSize), Number((pageIndex-1)*pageSize)], (err, results) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
        }
        if(bool) {
            db.query(getTotal, 0, (err, dataTotal) => {
                if (err) {
                    bool = false
                    res.st(err, '', 0)
                }
                res.st('数据获取成功', results, 1, dataTotal.length)
            })
            
        }
    })
}

//获取入库报表
exports.inStoReport = async (req, res) => {
    let bool = true
    const {
        pageSize,
        pageIndex,
    } = req.body
    db.query(inStoReport, [Number(pageSize), Number((pageIndex-1)*pageSize)], (err, results) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
        }
        if(bool) {
            db.query(getTotal, 1, (err, dataTotal) => {
                if (err) {
                    bool = false
                    res.st(err, '', 0)
                }
                res.st('数据获取成功', results, 1, dataTotal.length)
            })
            
        }
    })
}
//获取出库报表
exports.outStoReport = async (req, res) => {
    let bool = true
    const {
        pageSize,
        pageIndex,
    } = req.body
    db.query(outStoReport, [Number(pageSize), Number((pageIndex-1)*pageSize)], (err, results) => {
        if (err) {
            bool = false
            res.st(err, '', 0)
        }
        if(bool) {
            db.query(getTotal, 2, (err, dataTotal) => {
                if (err) {
                    bool = false
                    res.st(err, '', 0)
                }
                res.st('数据获取成功', results, 1, dataTotal.length)
            })
            
        }
    })
}