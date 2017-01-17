var aws=require('aws-sdk')
var region=process.env.REGION
if(region){

}else{
    region='us-east-1'
}

var s3=new aws.S3(process.env.REGION)

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            var params={
                Bucket:props.bucket,
                Key:props.key,
                Body:"Healthy!"
            }
            
            s3.putObject(
                params,
                function(err,data){
                    if(err){
                        reject(err)
                    }else{
                        resolve(data)
                    }
                })
        }else{
            resolve()
        }
    })
    return out
}
module.exports.destory=function(event){
    var out=new Promise(function(resolve,reject){
        if(event.RequestType==="Delete" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            var params={
                Bucket:props.bucket,
                Key:props.key
            }
            
            s3.deleteObject(
                params,
                function(err,data){
                    if(err){
                        console.log(err)
                        reject(err)
                    }else{
                        resolve(data)
                    }
                }
                )
           
        }else{
            resolve()
        }
    })
    return out
}
