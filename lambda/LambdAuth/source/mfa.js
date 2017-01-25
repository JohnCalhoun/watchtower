var speakeasy=require('speakeasy')
var qr=require('qr-image')
var ops=require('./operations')

exports.gen=function(id){
    var secret=speakeasy.generateSecret();
    var qrcode=qr.svgObject(secret.otpauth_url).path
    
    return ops.update(id,{
            mfaSecret:secret.base32,
            mfaQrcode:qrcode,
            mfaEnabled:false
        }
    )
}

exports.get=function(id){
    return new Promise(function(resolve,reject){
        ops.get(id).then(
            function(results){
                resolve({
                    secret:results.mfaSecret,
                    qr:results.mfaQrcode
                })
            },function(err){
                reject(err)
            }
        )
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

