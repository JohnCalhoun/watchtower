var mysql=require('mysql')
var sql=require('sql')
var crypto=require('crypto')
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

var delete_privilege=function(con,id){
    return new Promise(function(resolve,reject){ 
        var params=id.split('|')
        username=mysql.escape(params[0])
        write=params[1]
        tables=params[2]
        
        if(write){
            privilege="SELECT,INSERT,DELETE"
            type="write"
        }else{
            privilege="SELECT"
            type="read"
        }
        var query="REVOKE "+privilege+" ON "+tables+" FROM "+username        
        
        con.query(
            query, 
            function(err){
                if(err) reject(err)
                resolve()
            })
    })
}

var delete_user=function(con,name){
    return new Promise(function(resolve,reject){ 
        var query="DROP USER IF EXISTS "+mysql.escape(name); 
        con.query(
            query, 
            function(err){
                if(err) reject(err)
                resolve()
            })       
    })
}

var delete_table=function(con,name){
    return new Promise(function(resolve,reject){ 
        var query="DROP TABLE IF EXISTS "+mysql.escapeId(name); 
        con.query(
            query, 
            function(err){
                if(err) reject(err)
                resolve()
            })
    })
}

var delete_ouput=function(){}

module.exports=function(physicalId,params,reply){
    var handle_err=function(err){
        if(err) reply(err)
    }

    connect()
    .then(
        function(con){
            switch (process.env.CR_TYPE){
                case 'table':
                    delete_table(con,physicalId)
                    .then(
                        function(){
                            reply(null,physicalId,null)
                        },
                        handle_err
                    )
                    break;
                case 'user':
                    delete_user(con,physicalId)
                    .then(
                        function(EncryptedPassword){
                            reply(null,physicalId,null)
                        },
                        handle_err
                    )
                    break;
                case 'privilege':
                    delete_privilege(con,physicalId)
                    .then(
                        function(id){
                            reply(null,physicalId,null)
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







