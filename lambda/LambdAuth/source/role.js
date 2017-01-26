var aws=require('aws-sdk')
var sts=new aws.STS({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')

exports.getCredentials = function(id,group) {
    var template=hb.compile(fs.readFileSync(__dirname+"/assets/user-role.json").toString())
    if(group==="admin"){
        var tempdata={user:id,admin:true}
    }else{
        var tempdata={user:id}
    }
    return new Promise(function(resolve,reject){ 
        var params={
            RoleArn: process.env.ROLE_ARN, 
            RoleSessionName: id,
            Policy:template(tempdata)
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
