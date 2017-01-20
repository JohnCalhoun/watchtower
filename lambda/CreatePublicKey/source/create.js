var crypto=require('crypto')
var rsa=require('node-rsa')
var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

module.exports=function(params,reply){
    var keyArn=params.keyArn 
    var key=new rsa({b:params.bitLength})
    key.generateKeyPair()
 
    var priv=key.exportKey('private')
    var pub=key.exportKey('public')

    var hash=crypto.createHash('sha256')

    hash.update(pub)
    var fingerprint=hash.digest('hex')

    kms.encrypt({
        KeyId:keyArn,
        Plaintext:priv,
        EncryptionContext:{}
    },function(err,data){
        if(err){
            reply(err)
        }else{
            priv=null
            console.log(data.CiphertextBlob.toString('base64'))
            console.log(pub)

            reply(
                null,
                fingerprint,
                { 
                    privateKey:data.CiphertextBlob,
                    publicKey:pub
                }
            )
        }
    })

}







