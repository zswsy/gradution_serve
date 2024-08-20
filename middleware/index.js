const Joi = require('joi')


exports.errorHandle= (err,req,res,next)=>{
    if(err instanceof Joi.ValidationError){
        //表单验证错的
        return res.st(err,'',0);
    }
    if (err.name === "UnauthorizedError") {
        //此处不适合使用res.cc的原因是因为处理请求头中的token时，res.cc还没有挂载上
        return res.send(JSON.stringify({
            status:2,
            success:'fail',
            message:'非法token---invalid token...',
            data:'',
        }))
      }

    next()
}

exports.sendTemplate=function(res, err, data='', status=1,total=0){
    //发送模板消息 status:0失败、1成功
    let obj={
        status: 1,
        success: 'success',
        message: '请求成功',
        data:'',
    }
    if(!status){
        obj.status=status
        obj.success='fail'
        obj.message=err instanceof Error ? err.message : err
        obj=Object.assign(obj,{data:data?data:'',total:total?total:0})
        // const str=JSON.stringify(obj)
        res.send(obj)
    }else{
        obj.status=status
        obj.message=err instanceof Error ? err.message : err
        obj=Object.assign(obj,{data:data?data:'',total:total?total:0})
        // const str=JSON.stringify(obj)
        res.send(obj)
    }
    
}