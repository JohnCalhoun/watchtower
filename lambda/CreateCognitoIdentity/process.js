var cognito=require('./cognito.js')

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            
            cognito.CreatePool(props)
                .then(function(data){
                    var id=data.IDPool.Id
                    cognito.CreateRoles(props,id)
                        .then(function(data2){
                            var out={}
                            out.ID=id
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
