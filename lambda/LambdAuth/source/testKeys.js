var crypto=require('crypto')
var rsa=require('node-rsa')
var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

module.exports=function(keyArn){
    var key=new rsa({b:256})
    key.generateKeyPair()
 
    var priv=key.exportKey('private')
    var pub=key.exportKey('public')

    return new Promise(function(resolve,reject){
        kms.encrypt({
            KeyId:keyArn,
            Plaintext:priv,
            EncryptionContext:{}
        },function(err,data){
            if(err){
                reject(err)
            }else{
                resolve({
                        privateKeyEncrypted:data.CiphertextBlob.toString('base64'),
                        privateKey:priv, 
                        publicKey:pub
                    }
                )
            }
        })
    })
}







