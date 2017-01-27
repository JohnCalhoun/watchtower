var aws=require('aws-sdk')
var sts=new aws.STS({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')

var assume_role=function(params){
    return new Promise(function(resolve,reject){ 
        sts.assumeRole(params,
            function(err,data){
                if(err){
                    reject(err)  
                }else{
                    resolve(data.Credentials)
                }
            }
        )
    })
}

exports.getCredentials = function(id,group) {
    var template=hb.compile(fs.readFileSync(__dirname+"/assets/user-role.json").toString())

    if(group==="admin"){
        var tempdata={user:id,admin:true}
    }else{
        var tempdata={user:id}
    }
    var params={
        RoleArn: process.env.ROLE_ARN, 
        RoleSessionName: id,
        Policy:template(tempdata)
    }
    return assume_role(params)
}
