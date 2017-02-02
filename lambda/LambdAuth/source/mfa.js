var speakeasy=require('speakeasy')
var qr=require('qr-image')
var ops=require('./operations')

var KMS=require('./KMS.js')

exports.gen=function(id){
    return KMS.encrypt(
        speakeasy.generateSecret().base32,
        {
            id:id,
            type:"MFA_Secret"
        }
        )
    .then(function(ciphertext){
        return ops.update(id,{
            mfaSecret:ciphertext,
            mfaEnabled:false
        })
    })
}

exports.get=function(id){
    var out=ops.get(id)
    .then(function(results){
        return KMS.decrypt(
            Buffer.from(results.mfaSecret,'base64'),
            {
                id:id,
                type:"MFA_Secret"
            }
        )
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

