var mysql=require('mysql')
var KMS=require('./KMS.js')
var Promise=require('bluebird')

var connect=function(password){
    return new Promise(function(resolve,reject){
        var connection=mysql.createConnection({
            host:process.env.DB_ENDPOINT,
            user:process.env.DB_USER,
            password:password,
            database:process.env.DB_NAME,
            trace:false
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
    var out=KMS.decrypt(
        Buffer.from(process.env.DB_PASSWORD,'base64'),
        {user:process.env.DB_USER}
        )
    .then(function(password){
        return(connect(password)) 
    })
    
    return out
}




