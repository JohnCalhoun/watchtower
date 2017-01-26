var speakeasy=require('speakeasy')
var qr=require('qr-image')
var ops=require('./operations')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

exports.gen=function(id){
    return new Promise(function(resolve,reject){ 
        kms.encrypt({
            KeyId:process.env.KMS_KEY,
            Plaintext:speakeasy.generateSecret().base32,
            EncryptionContext:{
                id:id,
                type:"MFA_Secret"
            }
        },function(err,data){
            if(err){
                reject(err)
            }else{
                ops.update(id,{
                    mfaSecret:data.CiphertextBlob.toString('base64'),
                    mfaEnabled:false
                }).then(function(){resolve()},function(err){reject(err)})
            }
        })
    })
}

exports.get=function(id){
    return new Promise(function(resolve,reject){
        ops.get(id).then(
        function(results){
            kms.decrypt(
                {
                    CiphertextBlob:Buffer.from(results.mfaSecret,'base64'),
                    EncryptionContext:{
                        id:id,
                        type:"MFA_Secret"
                    }
                },
                function(err,data){
                    if(err){
                        reject(err)
                    }else{
                        var secret=data.Plaintext.toString()
                        var qrcode=qr.svgObject("otpauth://totp/SecretKey?secret="+results.mfaSecret).path
                        resolve({
                            secret:results.mfaSecret,
                            qr:qrcode
                        })
                    }
                }
            )
        },function(err){reject(err)})
    })
}

exports.auth=function(id,token){
    return new Promise(function(resolve,reject){
        exports.get(id).
        then(function(results){
            if(results.mfaEnabled){
                var val=speakeasy.totp.verify({
                        secret:results.secret,
                        encoding:'base32',
                        token:token
                    })
                resolve(val)
            }else{
                resolve(true)
            }
        },function(err){
            reject(err)
        })
    })
}

exports.val=function(id,token){
    return new Promise(function(resolve,reject){
        exports.auth(id,token).
        then(function(results){
            if(results){
                ops.update(id,{mfaEnabled:true}).
                then(function(){
                    resolve(true)
                },function(err){
                    reject(err) 
                })
            }else{
                resolve(false)
            }
        },function(err){
            reject(err)
        })
    })
}
