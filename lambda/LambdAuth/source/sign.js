var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var schema=require(__dirname+'/assets/returnschema.json')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})
var hash='RSA-SHA512'

module.exports=function(output,callback){
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
                    var result=JSON.stringify(output)
                    var privateKey=data.Plaintext.toString() 
                    sign = crypto.createSign(hash);
                    sign.update(result);

                    var out={
                        result:result,
                        hash:hash,
                        signature:sign.sign(privateKey, 'hex')
                    }
                    callback(null,out)
                }catch(err){
                    callback(err)
                }
            } 
        }
    )
}

