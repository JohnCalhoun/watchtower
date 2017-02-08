var crypto=require('crypto')
var rsa=require('node-rsa')
var Promise=require('bluebird')

module.exports=function(keyArn){
    var key=new rsa({b:256})
    key.generateKeyPair()
 
    var priv=key.exportKey('private')
    var pub=key.exportKey('public')

    return Promise.resolve({
        privateKey:priv, 
        publicKey:pub
    })
}







