var ops=require('./operations.js')
   
module.exports=function(group='modp18',bitlength=1024){
    var client=require('./SRP/client.js')(group,bitlength);
    var server=require('./SRP/server.js')(group,bitlength);

    var out={}
    out.genVerifier=function(I,P){
        return client.getSaltVerifier(I,P)
    }

    out.getSharedKey = function(A,user,hotp) {
        return ops.get(user)
            .then(function(results){
                var check=server.checkHotp(Buffer.from(results.verifier,'hex'),hotp)
                
                return check ? results : Promise.reject('Hotp check Failed')
            })
            .then(function(results){
                return server.genBandShared(A,results.salt,results.verifier)
            })
    }
    return out
}
