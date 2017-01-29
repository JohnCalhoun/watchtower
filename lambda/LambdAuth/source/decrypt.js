var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var messageschema=require(__dirname+'/assets/messageschema.json')
var bodyschema=require(__dirname+'/assets/bodyschema.json')

var KMS=require('./KMS.js')
var fail=function(){
    return new Promise(function(res,reject){
        reject("Invalid Input")
    })
}
module.exports=function(input){
    if(!validate(input,bodyschema).valid){
        return fail()
    }else if(input.payload){
        return KMS.decrypt(Buffer.from(process.env.RSA_PRIVATE_KEY,'base64'))
        .then(function(privateKey){ 
            var pass=crypto.privateDecrypt(privateKey,Buffer.from(input.key,'base64'))
            
            var decipher = crypto.createDecipher(input.algorithm,pass)
            var dec = decipher.update(input.payload,'hex','utf8')
            dec += decipher.final('utf8');
            
            var message=JSON.parse(dec)
            if(validate(message,messageschema).valid){
                return(message)
            }else{
                console.log(validate(message,messageschema))
                return(fail())  
            }
        })

    }else{
        return new Promise(function(resolve,reject){   
            var message=input
            message.action='session'
            validate(message,messageschema) 
            if(validate(message,messageschema).valid){
                resolve(message)
            }else{
                reject(fail)  
            }
        })
    }
}

