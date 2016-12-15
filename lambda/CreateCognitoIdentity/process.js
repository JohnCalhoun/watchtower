var cognito=require('./cognito.js')

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            
            congito.CreatePool(props)
                .then(function(data){
                    var id=data.UserPool.Id
                    cognito.createApp(props,id)
                        .then(function(data2){
                            var out={}
                            out.ID=id
                            out.clientID=data2.UserPoolClient.UserPoolId
                            resolve(out)
                        },
                        function(err){
                            reject(err)
                        })       
                },
                function(err){
                    reject(err)
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
        }else{
            resolve()
        }
    })
    return out
}
