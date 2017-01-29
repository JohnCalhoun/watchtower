var jsrp=require('jsrp')
var ops=require('./operations.js')
var KMS=require('./KMS.js')

var srp=function(salt,verifier,B){
    return new Promise(function(resolve,reject){
        var server=new jsrp.server()
        server.init({
            salt:salt,
            verifier:verifier
        },
        function(){
            try{ 
                server.setClientPublicKey(B)
                var publicKey=server.getPublicKey()
                resolve({
                    salt:salt,
                    publicKey:server.getPublicKey(),
                    sharedKey:server.getSharedKey()
                })
            }catch(e){
                reject(e)
            }
        })
    })
}

exports.getSharedKey = function(B,user) {
    var out=KMS.decrypt(
        Buffer.from(process.env.DB_PASSWORD,'base64'),
        {user:process.env.DB_USER}
        )
        .then(function(password){
            return ops.get(user)
        })
        .then(function(results){
            return srp(results.salt,results.verifier,B)
        })
    return out   
}


