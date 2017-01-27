var speakeasy=require('speakeasy')
var qr=require('qr-image')
var ops=require('./operations')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

var kms_encrypt=function(input,id){
    return new Promise(function(resolve,reject){
        kms.encrypt({
            KeyId:process.env.KMS_KEY,
            Plaintext:input,
            EncryptionContext:{
                id:id,
                type:"MFA_Secret"
            }
        },function(err,data){
            if(err){
                reject(err)
            }else{
                resolve(data.CiphertextBlob.toString('base64'))
            }
        })
    })
}

exports.gen=function(id){
    var out=kms_encrypt(speakeasy.generateSecret().base32,id)
    .then(function(ciphertext){
        return ops.update(id,{
            mfaSecret:ciphertext,
            mfaEnabled:false
        })
    })

    return(out)
}

var kms_decrypt=function(text,id){
    return new Promise(function(resolve,reject){
        kms.decrypt(
            {
                CiphertextBlob:Buffer.from(text,'base64'),
                EncryptionContext:{
                    id:id,
                    type:"MFA_Secret"
                }
            },
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(data.Plaintext.toString())
                }
            }
        )
    })
}

exports.get=function(id){
    var out=ops.get(id)
    .then(function(results){
        return kms_decrypt(results.mfaSecret,id)
    })
    .then(function(secret){
        return({
            secret:secret,
            qr:qr.imageSync("otpauth://totp/SecretKey?secret="+secret).toString('base64')
        })
    })
    return(out)
}

var check=function(id,enabled,token){
    return new Promise(function(resolve,reject){
        if(enabled){
            exports.get(id)
            .then(function(secret){
                var val=speakeasy.totp.verify({
                        secret:secret.secret,
                        encoding:'base32',
                        token:token
                    })
                if(val){
                    resolve(true)
                }else{
                    reject("Authenication Failed")
                }
            },
            reject)
        }else{
            resolve(true)
        }
    })
}

exports.auth=function(id,token){
    var out=ops.get(id).
    then(function(results){
        return(check(id,results.mfaEnabled,token)) 
    })

    return(out)
}

exports.val=function(id,token){
     
    var out=exports.auth(id,token)
        .then(function(results){
            return(ops.update(id,{mfaEnabled:true}))
        })
        .then(function(){
            return(true)
        })

    return(out)
}

