var aws=require('aws-sdk')
var region=process.env.REGION
var cognito=new aws.CognitoIdentityServiceProvider({region:region})

module.exports.CreatePool=function(props){   
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
    
    var out=new Promise(function(resolve,reject){
        cognito.createUserPool(
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

module.exports.CreateApp=function(props,userPoolId){   
    var params={
        ClientName: props.PoolName+'-app', /* required */
        UserPoolId: userPoolId
    }
    
    var out=new Promise(function(resolve,reject){
        cognito.createUserPoolClient(
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

module.exports.deleteBoth=function(event){ 
    pool=event.PhysicalResourceId.split('|')[0]
    app=event.PhysicalResourceId.split('|')[1]

    var paramsPool={
        UserPoolId:pool
    }
    var paramsApp={
        UserPoolId:pool,
        ClientId:app
    }
    console.log(paramsPool)  
    console.log(paramsApp)  

    var deleteApp=function(resolve,reject){
        cognito.deleteUserPoolClient(
            paramsApp,
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

    var deletePool=function(resolve,reject){
        cognito.deleteUserPool(
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
    
    var tmp=new Promise(deleteApp)
    
    var out=tmp.then(function(){
        return new Promise(deletePool)
    })
    return out
}







