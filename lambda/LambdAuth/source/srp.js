var bitlength=1024
var client=require('./SRP/client.js')('modp18',bitlength);
var server=require('./SRP/server.js')('modp18',bitlength);
var Promise=require('bluebird')

var ops=require('./operations.js')
    
exports.genVerifier=function(I,P){
    return client.getSaltVerifier(I,P)
}

exports.getSharedKey = function(A,user,hotp) {
    return ops.get(user)
        .then(function(results){
            var check=server.checkHotp(Buffer.from(results.verifier,'hex'),hotp)
            
            return check ? results : Promise.reject('failed')
        })
        .then(function(results){
            return server.genBandShared(A,results.salt,results.verifier)
        })
}


