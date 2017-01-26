var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var schema=require(__dirname+'/assets/returnschema.json')
var srp=require('./srp.js')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})
var hash='RSA-SHA512'

module.exports=function(output,callback,message){
    kms.decrypt(
        {
            CiphertextBlob:Buffer.from(process.env.RSA_PRIVATE_KEY,'base64')
        },
        function(err,data){
            if(err){
                reject(err)
            }else{
                try{ 
                    validate(output,schema,{throwError:true}) 
                    
                    srp.getSharedKey(message.B,message.id)
                    .then(function(keys){
                        
                        const cipher = crypto.createCipher('aes192',keys.sharedKey);

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
                            publicKey:keys.publicKey
                        }
                        callback(null,out)
                    },
                    function(err){callback(err)})
                }catch(err){
                    callback(err)
                }
            } 
        }
    )
}

