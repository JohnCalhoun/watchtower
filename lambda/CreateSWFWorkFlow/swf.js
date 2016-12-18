var aws=require('aws-sdk')
var region=process.env.AWS_REGION
var swf=new aws.SWF({region:process.env.REGION})

module.exports.createWorkflow=function(props){
    var params={
        domain:props.domain,
        name:props.name,
        version:props.version
    }
    
    var ID=[props.domain,props.name,props.version].join('|')
    
    var out=new Promise(function(resolve,reject){
        swf.registerWorkflowType(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(ID)
                }
            })
    })
    return out
}

module.exports.deleteWorkflow=function(event){
    var args=event.PhysicalResourceId.split('|')
    var params={
        domain:args[0],
        workflowType:{
            name:args[1],
            version:args[2]
        }
    }

    var out=new Promise(function(resolve,reject){
        swf.deprecateWorkflowType(
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

