var mysql=require('mysql')
var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})

var get_password=function(){
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
                    resolve(data.Plaintext)
                }
            }
        )
    })
}

var connect=function(password){
    return new Promise(function(resolve,reject){
        var connection=mysql.createConnection({
            host:process.env.DB_ENDPOINT,
            user:process.env.DB_USER,
            password:password,
            database:process.env.DB_NAME
        })
        connection.connect(function(err){
            if(err){
                reject(err)
            }else{
                resolve(connection)
            }
        })
    })
}

module.exports=function(){
    var out=get_password()
    .then(function(password){
        return(connect(password)) 
    })
    
    return out
}




