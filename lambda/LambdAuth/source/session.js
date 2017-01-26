var role=require('./role.js')
var mfa=require('./mfa.js')
var ops=require('./operations.js')

module.exports=function(user,B,token){
    return new Promise(function(resolve,reject){
        var Error=function(err){
            console.log(err)
            reject(err)
        }
        mfa.auth(user,token) 
        .then(function(val){
            if(val){
                ops.get(user)
                .then(function(result){
                    role.getCredentials(user,result.groupId)
                    .then(function(credentials){
                        resolve(credentials)
                    },Error)
                },Error)
            }else{
             resolve(false)
            }
        },Error)
    })
}
