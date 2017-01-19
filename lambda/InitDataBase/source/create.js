var mysql=require('mysql')
var sql=require('sql')
var crypto=require('crypto')
var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})
sql.setDialect('mysql')

PasswordLength=15

var connect=function(){
    return new Promise(function(resolve,reject){ 
        var connection=mysql.createConnection({
            host:process.env.DB_ENDPOINT,
            user:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_NAME
        })
        
        connection.connect(function(err){
            if(err){
                reject(err)
            }else{
                resolve(connection)
            }
        });
    })
}

var create_privilege=function(con,user,write,tables){
    return new Promise(function(resolve,reject){ 
        username=mysql.escape(user)
        if(write){
            privilege="SELECT,INSERT,DELETE"
            type="write"
        }else{
            privilege="SELECT"
            type="read"
        }
        //tables=mysql.escapeId(tables)
        var query="GRANT "+privilege+" ON "+mysql.escapeId(process.env.DB_NAME)+"."+mysql.escapeId(tables)+" TO "+username        
        
        con.query(
            query, 
            function(err){
                if(err) reject(err)
                resolve(user+"|"+type+"|"+tables)
            })
    })
}

var create_user=function(con,name){
    return new Promise(function(resolve,reject){ 
        var password=crypto.randomBytes(PasswordLength).toString('hex')
         
        var query="CREATE USER IF NOT EXISTS "+mysql.escape(name)+" IDENTIFIED BY "+mysql.escape(password); 

        con.query(
            query, 
            function(err){
                if(err) reject(err)
                kms.encrypt({
                    KeyId:process.env.KMS_KEY,
                    Plaintext:password,
                    EncryptionContext:{
                        user:name 
                    }
                },function(err,data){
                    if(err) reject(err)
                    resolve(data.CiphertextBlob)
                })
                //kms envrypt password
            })       
    })
}

var create_table=function(con,name,schema){
    return new Promise(function(resolve,reject){ 
        var table=sql.define({
            name:name,
            columns:schema
        })
        var query=table.create().toString()
        con.query(
            query, 
            function(err){
                if(err) reject(err)
                resolve()
            })
    })
}

var create_ouput=function(){}

module.exports=function(params,reply){
    var handle_err=function(err){
        if(err) reply(err)
    }

    connect()
    .then(
        function(con){
            switch (process.env.CR_TYPE){
                case 'table':
                    create_table(con,params.TableName,params.TableSchema)
                    .then(
                        function(){
                            reply(null,params.TableName,null)
                        },
                        handle_err
                    )
                    break;
                case 'user':
                    create_user(con,params.UserName)
                    .then(
                        function(EncryptedPassword){
                            reply(null,params.UserName,{password:EncryptedPassword})
                        },
                        handle_err
                    )
                    break;
                case 'privilege':
                    create_privilege(con,params.UserName,params.UserWrite,params.UserTableAccess)
                    .then(
                        function(id){
                            reply(null,id,null)
                        },
                        handle_err
                    )
                    break;


                default:
                    reply("Error: Resource type must be table,user,privilege. not-"+process.env.CR_TYPE)
            }
        },
        handle_err
    )
}







