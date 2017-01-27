var role=require('./role.js')
var mfa=require('./mfa.js')
var ops=require('./operations.js')

module.exports=function(user,B,token){
    
    var out=mfa.auth(user,token) 
    .then(function(){
        return(ops.get(user))
    })
    .then(function(result){
        return(role.getCredentials(user,result.groupId))
    })
    .then(null,function(err){
        console.log(err)
        return(false)
    })
    
    return(out)
}
