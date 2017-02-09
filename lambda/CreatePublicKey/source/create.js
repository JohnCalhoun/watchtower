var crypto=require('crypto')
var rsa=require('node-rsa')

module.exports=function(params,reply){
    var keyArn=params.keyArn 
    var key=new rsa({b:params.bitLength})
    key.generateKeyPair()
 
    var priv=key.exportKey('private')
    var pub=key.exportKey('public')

    var hash=crypto.createHash('sha256')

    hash.update(pub)
    var fingerprint=hash.digest('hex')

    reply(
        null,
        fingerprint,
        { 
            privateKey:priv,
            publicKey:pub
        }
    )
}







