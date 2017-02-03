var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})
var Promise=require('bluebird')

exports.decrypt=function(input,context={}){
    return new Promise(function(resolve,reject){
        kms.decrypt(
            {
                CiphertextBlob:Buffer.from(input,'base64'),
                EncryptionContext:context
            },
            function(err,data){
                err ? reject(err) : resolve(data.Plaintext.toString())
            }
        )
    })
}

exports.encrypt=function(input,context={}){
    return new Promise(function(resolve,reject){
        kms.encrypt({
            KeyId:process.env.KMS_KEY,
            Plaintext:input,
            EncryptionContext:context
        },function(err,data){
            err ? reject(err) : resolve(data.CiphertextBlob.toString('base64'))
        })
    })
}


