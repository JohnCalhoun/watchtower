var aws=require('aws-sdk')
var region=process.env.REGION
var cognito=new aws.CognitoIdentity({region:region})

module.exports.CreatePool=function(props){   
    var params={
            }
    
    var out=new Promise(function(resolve,reject){
        cognito.createIdentityPool(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
    })
    return out
}

module.exports.CreateRoles=function(props,IdentityPoolId){   
    var params={
    }
    
    var out=new Promise(function(resolve,reject){
        cognito.setIdentityPoolRoles(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
    })
    return out
}

module.exports.deletePool=function(event){ 
    var params={
        IdentityPoolId:event.PhysicalResourceId
    }
    
    var deletePool=function(resolve,reject){
        cognito.deleteIdentityPool(
            paramsPool,
            function(err,data){
                if(err){
                    console.log(err)
                    reject(err)
                }else{
                    resolve(data)
                }
            }
            )
    }
    
    return new Promise(deletePool)
}







