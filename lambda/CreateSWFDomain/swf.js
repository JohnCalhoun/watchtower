var aws=require('aws-sdk')
var region=process.env.AWS_REGION
var swf=new aws.SWF({region:process.env.REGION})


module.exports.createDomain=function(props){
    var params={
        name:props.name,
        workflowExecutionRetentionPeriodInDays:props.retention
    }

    var out=new Promise(function(resolve,reject){
        swf.registerDomain(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(props.name)
                }
            })
    })
    return out
}

module.exports.deleteDomain=function(event){
    var params={
        name:event.PhysicalResourceId
    }

    var out=new Promise(function(resolve,reject){
        swf.deprecateDomain(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve()
                }
            })
    })
    return out
}

