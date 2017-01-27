var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var schema=require(__dirname+'/assets/returnschema.json')
var srp=require('./srp.js')
var log=require('./log.js')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})
var hash='RSA-SHA512'
var algorithm="aes-256-cbc-hmac-sha256"

var get_key=function(){
    return new Promise(function(resolve,reject){
        kms.decrypt(
            {
                CiphertextBlob:Buffer.from(process.env.RSA_PRIVATE_KEY,'base64')
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


module.exports=function(output,callback,message){
    var private_key_promise=get_key()
    var shared_key_promise=srp.getSharedKey(message.B,message.id)

    Promise.all([private_key_promise,shared_key_promise])
    .then(function(keys){
        try{
            const cipher = crypto.createCipher(algorithm,keys[1].sharedKey);
            var result = cipher.update(JSON.stringify(output), 'utf8', 'hex');
            result += cipher.final('hex');
            
            sign = crypto.createSign(hash);
            sign.update(result);

            var out={
                result:result,
                hash:hash,
                signature:sign.sign(keys[0], 'hex'),
                salt:keys.salt,
                publicKey:keys.publicKey,
                algorithm:algorithm
            }
            callback(null,out)
        }catch(err){
            callback(err)
        }
    })
}

