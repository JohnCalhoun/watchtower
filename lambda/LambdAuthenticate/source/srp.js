var jsrp=require('jsrp')
var sql=require('sql')
sql.setDialect('mysql')
var mysql=require('mysql')

var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

exports.getSharedKey = function(B,user) {
    
    var userTable=sql.define({
        name:'users',
        columns:[
            {
                name:"id",
                dataType:"text"
            },
            {
                name:"salt",
                dataType:"text"
            },
            {
                name:"verifier",
                dataType:"text"
            },
            {
                name:"arn",
                dataType:"text"
            },
        ]
    })
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
                var connection=mysql.createConnection({
                    host:process.env.DB_ENDPOINT,
                    user:process.env.DB_USER,
                    password:data.Plaintext,
                    database:process.env.DB_NAME
                })

                var query=userTable
                .select(userTable.salt,userTable.verifier,userTable.arn)
                .from(userTable)
                .where(userTable.id.equals(user))
                .toQuery()

                connection.query(
                    query.text,
                    query.values,
                    function(err,results,fields){
                        if(err) reject(err)
                        
                        salt=results[0].salt
                        verifier=results[0].verifier
                        arn=results[0].arn

                        var server=new jsrp.server()
                        
                        server.init({
                            salt:salt,
                            verifier:verifier
                        },
                        function(){
                            server.setClientPublicKey(B)
                            var publicKey=server.getPublicKey()
                            
                            out={
                                salt:salt,
                                publicKey:server.getPublicKey(),
                                sharedKey:server.getSharedKey(),
                                arn:arn
                            }
                            resolve(out)
                        })
                    }
                )
            }
        )
    })
}


