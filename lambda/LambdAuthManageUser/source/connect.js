var mysql=require('mysql')
var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})

module.exports=function(){
    return new Promise(function(resolve,reject){
         kms.decrypt(
            {
                CiphertextBlob:Buffer.from(process.env.DB_PASSWORD,'base64'),
                EncryptionContext:{
                    user:process.env.DB_USER
                }
            },       
            function(err,data){
                if(err){
                    reject(err)
                }else{
                    var connection=mysql.createConnection({
                        host:process.env.DB_ENDPOINT,
                        user:process.env.DB_USER,
                        password:data.Plaintext,
                        database:process.env.DB_NAME
                    })
                    connection.connect(function(err){
                        if(err){reject(err)}else{
                            resolve(connection)
                        }
                    })
                }
            }
        )
    })
}




