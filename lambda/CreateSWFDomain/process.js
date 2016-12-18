var swf=require('./swf.js')

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            var props=event.ResourceProperties
            swf.createDomain(props).then(
                resolve,
                reject
            )
        }else{
            resolve()
        }
    })
    return out
}
module.exports.destory=function(event){
    var out=new Promise(function(resolve,reject){
        if(event.RequestType==="Delete" | event.RequestType==="Update"){
            swf.deleteDomain(event).then(
                resolve,
                reject
            )
        }else{
            resolve()
        }
    })
    return out
}
