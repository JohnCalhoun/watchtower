var srp=require('./srp.js')
var role=require('./role.js')
var crypto=require('crypto')
var algorithm='aes-256-ctr'
var mfa=require('./mfa.js')
var Error=function(err){console.log(err)}
module.exports=function(user,B,token){
    return new Promise(function(resolve,reject){
        mfa.auth(user,token) 
        .then(function(val){
            if(val){
                srp.getSharedKey(B,user)
                .then(function(result){
                    role.getCredentials(result.arn,user)
                    .then(function(credentials){
                        var cipher=crypto.createCipher(algorithm,result.sharedKey)
                        var ciphertext=cipher.update(JSON.stringify(credentials),'utf8','hex')
                        ciphertext+=cipher.final('hex')

                        out={
                            algorithm:algorithm,
                            credentials:ciphertext,
                            salt:result.salt,
                            A:result.publicKey
                        }
                        resolve(out)
                    },Error)
                },Error)
            }else{
                resolve(false)
            }
        },Error)
    })
}
