var aws=require('aws-sdk')
var parseStacks=function(data){
    var out={}
    for(var i=0;i<data.length;i++){
        if(data[i].StackName===stackname){
            var outputs=data[i].Outputs 
            for(var j=0;j<outputs.length;j++){
                var key=outputs[j].OutputKey
                if(key==="WebsiteBucket"){ 
                    out[key]=outputs[j].OutputValue
                }
            }
        }
    }
    console.log(out)
    return out
}

var getOutputs=function(stack){
    var cloudformation=new aws.CloudFormation({region:'us-east-1'})
    var params={
            StackName:stack
        }

    var out=new Promise(function(resolve,reject){
        cloudformation.describeStacks(params,
            function(err,data){
                if(!err){
                    resolve(parseStacks(data.Stacks))
                }else{
                    reject(err)
                }
            })
    })
    return out
}

var getWebsiteBucket=function(config){
    stackname=config.get("stackName")
    getOutputs(stackname)
        .then(function(output){
            for(key in output){
                config.set(key,output[key])
            } 
        },function(err){
            console.log(err)
        })
}

module.exports=getWebsiteBucket








