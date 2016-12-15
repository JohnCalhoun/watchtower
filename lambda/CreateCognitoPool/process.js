var aws=require('aws-sdk')
var region=process.env.REGION
console.log("region="+region)
var cognito=new aws.CognitoIdentityServiceProvider({region:region})

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            var params={
                PoolName:props.PoolName,
                AdminCreateUserConfig: {
                    AllowAdminCreateUserOnly: true,
                    InviteMessageTemplate: {
                        //EmailMessage: 'STRING_VALUE',
                        //EmailSubject: 'STRING_VALUE'
                    },
                    UnusedAccountValidityDays: 10
                },
                AliasAttributes:[
                    "email"
                ],
                AutoVerifiedAttributes:[
                    "email"
                ],
                //EmailVerificationMessage: 'STRING_VALUE',
                //EmailVerificationSubject: 'STRING_VALUE',
                Policies: {
                    PasswordPolicy: {
                        MinimumLength: 8,
                        RequireLowercase: false,
                        RequireNumbers: true,
                        RequireSymbols: true,
                        RequireUppercase: true
                    }
                },
                Schema:[
                    {
                        AttributeDataType:'String',
                        Name:'Company',
                        Mutable:true
                    },
                    {
                        AttributeDataType:'String',
                        Name:'Name',
                        Mutable:true
                    }
                ]
            }
            
            cognito.createUserPool(
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
                UserPoolId:event.PhysicalResourceId
            }
            cognito.deleteUserPool(
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
