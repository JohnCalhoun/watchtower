var aws=require('aws-sdk')
var s3=new aws.S3({region:process.env.REGION})
var Promise=require('bluebird')

exports.get=function(bucket,file){
    var params={
        Bucket:bucket,
        Key:file
    }
    return new Promise(function(resolve,reject){ 
        s3.getObject(
            params,
            function(err,data){
                if(err){reject(err)}else{
                    resolve(JSON.parse(data.Body.toString()))
                }
            }
        )
    })
}

exports.merge=function(input,output){
    for(key in input){
        output[key]=input[key]
    }
}
