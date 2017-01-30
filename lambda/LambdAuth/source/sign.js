var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var schema=require(__dirname+'/assets/returnschema.json')
var srp=require('./srp.js')
var log=require('./log.js')

var hash='RSA-SHA512'
var algorithm="aes-256-cbc-hmac-sha256"

var KMS=require('./KMS.js')

module.exports=function(output,callback,message){
    var private_key_promise=KMS.decrypt(Buffer.from(process.env.RSA_PRIVATE_KEY,'base64'))

    var shared_key_promise=srp.getSharedKey(message.B,message.id)
   
    Promise.all([private_key_promise,shared_key_promise])
    .then(function(keys){
        try{    
            const cipher = crypto.createCipher(algorithm,keys[1].key);
            var payload=JSON.stringify({
                result:output,
                publicKey:keys.publicKey
            })
            var result = cipher.update(payload, 'utf8', 'hex');
            result += cipher.final('hex');
            
            sign = crypto.createSign(hash);
            sign.update(result);

            var out={
                result:result,
                hash:hash,
                signature:sign.sign(keys[0], 'hex'),
                salt:keys.salt,
                algorithm:algorithm
            }
            callback(null,out)
        }catch(err){
            callback(err)
        }
    })
    .then(null,function(err){callback(err)})
}

