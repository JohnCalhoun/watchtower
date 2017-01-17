var aws=require('aws-sdk')
var region=process.env.AWS_REGION
var cognito=new aws.CognitoIdentity({region:region})

module.exports.CreatePool=function(props){   
    var params={
            AllowUnauthenticatedIdentities: true,
            IdentityPoolName: props.IdentityPoolName,
            CognitoIdentityProviders: []
        }

    props.Providers.forEach(function(provider){
        var client=provider.ClientId
        var provider="cognito-idp."+region+".amazonaws.com/"+provider.ProviderName
        
        params.CognitoIdentityProviders.push(
            {   ClientId:client,
                ProviderName:provider
            }
            )
    })
    console.log(params) 
    var out=new Promise(function(resolve,reject){
        cognito.createIdentityPool(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    console.log(data)
                    resolve(data.IdentityPoolId)
                }
            })
    })
    return out
}

module.exports.CreateRoles=function(props,IdentityPoolId){   
    var params={
        IdentityPoolId:IdentityPoolId,
        Roles:{
            authenticated:props.authenticatedRole,
            unauthenticated:props.unauthenticatedRole
        }
    }
    
    var out=new Promise(function(resolve,reject){
        cognito.setIdentityPoolRoles(
            params,
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    console.log(data)
                    resolve()
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
    }
    return new Promise(deletePool)
}







