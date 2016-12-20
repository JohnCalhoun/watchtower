var aws=require('aws-sdk')
var config_file=__dirname+'/../config.json'
var config=require(config_file)
var stackname=config.stackName

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
                if(key==="ApiId"){ 
                    out[key]=outputs[j].OutputValue
                }
            }
        }
    }
    console.log(out)
    return out
}


var getOutputs=function(){
    var cloudformation=new aws.CloudFormation({region:'us-east-1'})
    var params={
            StackName:stackname
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

var getWebsiteBucket=function(){
    getOutputs(stackname)
        .then(function(output){
            var fs=require('fs')
            
            for(key in output){
                config[key]=output[key]
            } 
            fs.writeFileSync(config_file,JSON.stringify(config,null,2))
        },function(err){
            console.log(err)
        })
}

getWebsiteBucket()








