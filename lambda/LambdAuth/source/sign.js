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

module.exports=function(output,callback,message){
    var Error=function(err){
        log(err,100)
        callback(true)
    }

    kms.decrypt(
        {
            CiphertextBlob:Buffer.from(process.env.RSA_PRIVATE_KEY,'base64')
        },
        function(err,data){
            if(err){
                Error(err)
            }else{
                try{ 
                    validate(output,schema,{throwError:true}) 
                    
                    srp.getSharedKey(message.B,message.id)
                    .then(function(keys){
                        
                        const cipher = crypto.createCipher(algorithm,keys.sharedKey);

                        var result = cipher.update(JSON.stringify(output), 'utf8', 'hex');
                        result += cipher.final('hex');
                        
                        var privateKey=data.Plaintext.toString() 
                        sign = crypto.createSign(hash);
                        sign.update(result);

                        var out={
                            result:result,
                            hash:hash,
                            signature:sign.sign(privateKey, 'hex'),
                            salt:keys.salt,
                            publicKey:keys.publicKey,
                            algorithm:algorithm
                        }
                        callback(null,out)
                    },Error)
                }catch(err){
                    Error(err)
                }
            } 
        }
    )
}

