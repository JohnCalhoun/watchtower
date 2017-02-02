var role=require('./role.js')
var mfa=require('./mfa.js')
var ops=require('./operations.js')
var log=require('./log.js')
var Promise=require('bluebird')
module.exports=function(user,B,token){
    
    var out=mfa.auth(user,token) 
    .then(function(){
        return(ops.get(user))
    })
    .then(function(result){
        return(role.getCredentials(user,result.groupId,result.mfaEnabled))
    })
    .then(null,function(err){
        log.log(err,log.levels.error)
        return(false)
    })
    
    return(out)
}
