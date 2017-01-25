var jsrp=require('jsrp')
var sql=require('sql')
sql.setDialect('mysql')
var mysql=require('mysql')
var ops=require('./operations.js')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

exports.getSharedKey = function(B,user) {
    return new Promise(function(resolve,reject){ 
        kms.decrypt(
            {
                CiphertextBlob:Buffer.from(process.env.DB_PASSWORD,'base64'),
                EncryptionContext:{
                    user:process.env.DB_USER
                }
            },
            function(err,data){
                if(err) reject(err)
                ops.get(user)
                .then(function(results){
                    var server=new jsrp.server()

                    server.init({
                        salt:results.salt,
                        verifier:results.verifier
                    },
                    function(){
                        server.setClientPublicKey(B)
                        var publicKey=server.getPublicKey()
                        
                        out={
                            salt:results.salt,
                            publicKey:server.getPublicKey(),
                            sharedKey:server.getSharedKey(),
                            arn:results.arn
                        }
                        resolve(out)
                    })
                })
            }
        )
    })
}


