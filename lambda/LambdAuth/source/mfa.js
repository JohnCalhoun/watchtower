var speakeasy=require('speakeasy')
var qr=require('qr-image')
var ops=require('./operations')
var Promise=require('bluebird')

exports.gen=function(id){
    return ops.update(id,{
        mfaSecret:speakeasy.generateSecret().base32,
        mfaEnabled:false
    })
}

exports.get=function(id){
    var out=ops.get(id)
    .then(function(results){
        return({
            secret:results.mfaSecret,
            qr:qr.imageSync("otpauth://totp/SecretKey?secret="+results.mfaSecret).toString('base64')
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
                val ? resolve(true) : reject("Authenication Failed")
            })
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

