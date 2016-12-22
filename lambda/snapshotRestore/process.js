var cognito=require('./cognito.js')

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            //register elasticsearch repo
            //setup dynamodb streams
        }else{
            resolve()
        }
    })
    return out
}
module.exports.destory=function(event){
    var out=new Promise(function(resolve,reject){
        if(event.RequestType==="Delete" | event.RequestType==="Update"){
            //unregister elasticsearch repo
            //setup dynamodb streams
        }else{
            resolve()
        }
    })
    return out
}
