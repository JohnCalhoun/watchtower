var srp=require('./srp.js')
var role=require('./role.js')
var crypto=require('crypto')
var algorithm='aes-256-ctr'

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})


var get_body=function(input){
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
                        resolve(out)
                    }catch(err){
                        reject(err)
                    }
                } 
            }
        )
    })
}

exports.handler = function(event, context,callback) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    get_body(JSON.parse(event.body))
    .then(function(body){
        var user=body.user
        var B=body.B
        
        srp.getSharedKey(B,user)
        .then(function(result){
            role.getCredentials(result.arn,user)
            .then(function(credentials){
                var cipher=crypto.createCipher(algorithm,result.sharedKey)
                var ciphertext=cipher.update(JSON.stringify(credentials),'utf8','hex')
                ciphertext+=cipher.final('hex')

                out={
                    algorith:algorithm,
                    credentials:ciphertext,
                    salt:result.salt,
                    A:result.publicKey
                }
                callback(null,out)
            },
            function(err){
                callback(err)
            })
        },
        function(err){
            callback(err)
        })
    },
    function(err){
        callback(err)
    })
}
