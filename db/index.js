const mysql = require('mysql');
const { SQLCONFIG } = require('../config');

const db = mysql.createConnection({
    ...SQLCONFIG
})
db.connect(err=>{
    if(err) throw err;
    console.log("connect successfully as id--------- "+db.threadId);
    
})
module.exports=db

// const db = mysql.createPool({
//     ...SQLCONFIG
// })
// exports.query= async (sql,playload)=>{
//     const last = await db.getConnection(async (err,connection)=>{
//         if(err) {
//             //console.log('数据库连接失败');
//             throw err;
//         }
//         const resu = await connection.query(sql,playload,(err,results)=>{
//             if(err) {
//                 //console.log('数据库查询失败');
//             }
//             //console.log(results,'results');
//             connection.release();
//             return results;
//         })
//         return resu;
//     })
//     return last;
// }


