var bitlength=1024
var client=require('./SRP/client.js')('modp18',bitlength);
var server=require('./SRP/server.js')('modp18',bitlength);

var ops=require('./operations.js')
var KMS=require('./KMS.js')
    
exports.genVerifier=function(I,P){
    return client.getSaltVerifier(I,P)
}

exports.getSharedKey = function(A,user) {
    var out=KMS.decrypt(
            Buffer.from(process.env.DB_PASSWORD,'base64'),
            {user:process.env.DB_USER}
        )
        .then(function(password){
            return ops.get(user)
        })
        .then(function(results){
            return server.genBandShared(A,results.salt,results.verifier)
        })
    return out   
}


