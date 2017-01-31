var bitlength=1024
var client=require('./SRP/client.js')('modp18',bitlength);
var server=require('./SRP/server.js')('modp18',bitlength);

var ops=require('./operations.js')
var KMS=require('./KMS.js')
    
exports.genVerifier=function(I,P){
    return client.getSaltVerifier(I,P)
}

exports.getSharedKey = function(A,user,hotp) {
    return ops.get(user)
        .then(function(results){
            if(server.checkHotp(Buffer.from(results.verifier,'hex'),hotp)){
                return results
            }else{
                return Promise.reject('failed')
            }
        })
        .then(function(results){
            return server.genBandShared(A,results.salt,results.verifier)
        })
}


