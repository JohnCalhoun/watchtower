var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var messageschema=require(__dirname+'/assets/messageschema.json')
var bodyschema=require(__dirname+'/assets/bodyschema.json')

var KMS=require('./KMS.js')

module.exports=function(input){
    var out=KMS.decrypt(Buffer.from(process.env.RSA_PRIVATE_KEY,'base64'))
    .then(function(privateKey){ 

        validate(input,bodyschema,{throwError:true}) 
        var pass=crypto.privateDecrypt(privateKey,Buffer.from(input.key,'base64'))
        
        var decipher = crypto.createDecipher(input.algorithm,pass)
        var dec = decipher.update(input.payload,'hex','utf8')
        dec += decipher.final('utf8');
        
        var out=JSON.parse(dec)
        validate(out,messageschema,{throwError:true}) 
        return(out)
    })

    return out
}

