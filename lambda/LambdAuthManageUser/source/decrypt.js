var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var schema=require(__dirname+'/assets/bodyschema.json')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

module.exports=function(input){
    return new Promise(function(resolve,reject){
        kms.decrypt(
            {
                CiphertextBlob:Buffer.from(process.env.RSA_PRIVATE_KEY,'base64')
            },
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    try{ 
                        var privateKey=data.Plaintext.toString()
                        var pass=crypto.privateDecrypt(privateKey,Buffer.from(input.key,'base64'))
                        
                        var decipher = crypto.createDecipher(input.algorithm,pass)
                        var dec = decipher.update(input.payload,'hex','utf8')
                        dec += decipher.final('utf8');
                        
                        var out=JSON.parse(dec)
                        validate(out,schema,{throwError:true}) 
                        resolve(out)
                    }catch(err){
                        reject(err)
                    }
                } 
            }
        )
    })
}

