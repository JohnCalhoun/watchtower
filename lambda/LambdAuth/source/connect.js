var mysql=require('mysql')
var KMS=require('./KMS.js')
var Promise=require('bluebird')

module.exports=function(){
    return new Promise(function(resolve,reject){
        var connection=mysql.createConnection({
            host:process.env.DB_ENDPOINT,
            user:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_NAME,
            trace:false
        })
        connection.connect(function(err){
            err ? reject(err) : resolve(connection)
        })
    })
}

