var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var messageschema=require(__dirname+'/assets/messageschema.json')
var bodyschema=require(__dirname+'/assets/bodyschema.json')
var log=require('./log.js')
var Promise=require('bluebird')
var KMS=require('./KMS.js')

module.exports=function(input){
    log.log("Begin Decypting message","Info")
     if(input.payload){
        return KMS.decrypt(Buffer.from(process.env.RSA_PRIVATE_KEY,'base64'))
        .then(function(privateKey){ 
            var pass=crypto.privateDecrypt(privateKey,Buffer.from(input.key,'base64'))
            
            var decipher = crypto.createDecipher(input.algorithm,pass)
            var dec = decipher.update(input.payload,'hex','utf8')
            dec += decipher.final('utf8');
            
            return JSON.parse(dec)
        })
    }else{
        var message=input
        message.action='session'
        return Promise.resolve(message)
    }
}

