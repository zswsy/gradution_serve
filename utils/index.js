exports.getTime = function (){
    const time= new Date()
    const year= time.getFullYear().toString();
    const month=(time.getMonth()+1).toString().padStart(2,'0');
    const date=time.getDate().toString().padStart(2,'0');
    const hour=time.getHours().toString().padStart(2,'0');
    const minute = time.getMinutes().toString().padStart(2,'0');
    const second = time.getSeconds().toString().padStart(2,'0');
    const str = year+'-'+month+'-'+date+' '+hour+':'+minute+':'+second;
    return str;
}

/**
 * 
 * @param {string} code 物料类型编码
 * code说明：
 * WL：物料
 * GYS：供应商
 * GC: 工程
 * @returns 
 */
exports.genCode = function (code){
    let materialCode=code;
    const time= new Date()
    const year= time.getFullYear().toString().slice(2,4);
    const month=(time.getMonth()+1).toString().padStart(2,'0');
    const date=time.getDate().toString().padStart(2,'0');
    const random=Math.floor(Math.random()*1000).toString().padStart(3,'0');
    materialCode+=year+month+date+random;
    return materialCode;
}

exports.genOrderCode = function (type) {
    let orderCode=type;
    const time= new Date()
    const year= time.getFullYear().toString().slice(2,4);
    const month=(time.getMonth()+1).toString().padStart(2,'0');
    const date=time.getDate().toString().padStart(2,'0');
    const hour=time.getHours().toString().padStart(2,'0');
    const minute = time.getMinutes().toString().padStart(2,'0');
    const random=Math.floor(Math.random()*10000).toString().padStart(4,'0');
    orderCode+=year+month+date+hour+minute+random;
    return orderCode;
}
