var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var messageschema=require(__dirname+'/assets/messageschema.json')
var bodyschema=require(__dirname+'/assets/bodyschema.json')

var KMS=require('./KMS.js')

module.exports=function(input){
    if(!validate(input,bodyschema).valid){
        return new Promise(function(res,reject){
            reject("Invalid Input")
        })
    }else if(input.payload){
        return KMS.decrypt(Buffer.from(process.env.RSA_PRIVATE_KEY,'base64'))
        .then(function(privateKey){ 
            var pass=crypto.privateDecrypt(privateKey,Buffer.from(input.key,'base64'))
            
            var decipher = crypto.createDecipher(input.algorithm,pass)
            var dec = decipher.update(input.payload,'hex','utf8')
            dec += decipher.final('utf8');
            
            var message=JSON.parse(dec)
            validate(message,messageschema,{throwError:true}) 
            return(message)
        })

    }else{
        return new Promise(function(res){   
            var message=input
            message.action='session'
            validate(message,messageschema,{throwError:true}) 
            res(message)
        })
    }
}

