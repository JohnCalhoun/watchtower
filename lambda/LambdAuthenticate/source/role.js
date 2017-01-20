var aws=require('aws-sdk')
var sts=new aws.STS({region:process.env.REGION})


exports.getCredentials = function(arn,id) {
    return new Promise(function(resolve,reject){ 
        var params={
            RoleArn: arn, 
            RoleSessionName: id
        }
        sts.assumeRole(params,
            function(err,data){
                if(err){
                    console.log(err)
                    reject(err)  
                }
                resolve(data.Credentials)
            }
        )
    })
}
