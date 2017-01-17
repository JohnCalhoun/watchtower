var cognito=require('./cognito.js')

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            
            cognito.CreatePool(props)
                .then(function(data){
                    cognito.CreateRoles(props,data)
                        .then(function(){
                            resolve(data)
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
            cognito.deletePool(event)
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
