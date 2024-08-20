const db = require('../../db/index')

const {
    getAllMaterial, getAllMaterialTotal, getlocationDetail
} = require('../../db/sql/materialManager/inStorageStock')

//物料入库 -- 分页
exports.getInStoMaterialList = (req, res) => {
    let bool = true
    let { keyword, pageSize, pageIndex } = req.body
    db.query(getAllMaterialTotal, [`%${keyword}%`,`%${keyword}%`], (err, total) => {
        db.query(getAllMaterial, [`%${keyword}%`, `%${keyword}%`, Number(pageSize), Number((Number(pageIndex)-1)*Number(pageSize))], (err, data) => {
            if(err){
                bool = false
                res.st(err, '', 0)
                return
            }
            if(data.length == 0) {
                bool = false
                res.st('库内暂无物料数据', [], 1)
            }else{
                // return res.st('数据获取成功',data,1,total.length)
                let tempArr = []
                data.forEach((item, index) => {
                    db.query(getlocationDetail, [item.material_id], (err, data1) => {
                        if(err){
                            bool = false
                            res.st(err, '', 0)
                            return
                        }else{
                            tempArr.push({
                                ...item,
                                locationDetail: data1
                            })
                            if(bool && index == data.length-1)
                            {
                                res.st('数据获取成功',tempArr,1,total.length)
                                return
                            }
                        }
                    })
                })
            }
        })
    })
    
}