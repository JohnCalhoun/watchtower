var aws=require('aws-sdk')
var sts=new aws.STS({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')
var Promise=require('bluebird')

var assume_role=function(params){
    return new Promise(function(resolve,reject){ 
        sts.assumeRole(params,
            function(err,data){
                err ? reject(err) : resolve(data.Credentials)
            }
        )
    })
}

exports.getCredentials = function(id,group,mfa) {
    var template=hb.compile(fs.readFileSync(__dirname+"/assets/user-role.json").toString())

    tempdata={user:id}
    if(group==="admin"){
        tempdata.admin=true
    }
    if(mfa){
        tempdata.mfa=true
    }
    var params={
        RoleArn: process.env.ROLE_ARN, 
        RoleSessionName: id,
        Policy:template(tempdata)
    }
    return assume_role(params)
}
