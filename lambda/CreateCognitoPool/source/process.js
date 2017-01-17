var cognito=require('./cognito.js')

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            
            cognito.CreatePool(props)
                .then(function(data){
                    var id=data.UserPool.Id
                    cognito.CreateApp(props,id)
                        .then(function(data2){
                            var out={}
                            out.ID=id
                            out.clientID=data2.UserPoolClient.ClientId
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
            cognito.deleteBoth(event)
                .then(function(){
                    resolve()
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
