process.env.REGION='us-east-1'

var config=require('../config.json')
var mysql=require('mysql')
var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})
var jsrp=require('jsrp')
var role=require('./role.js')
var srp=require('./srp.js')
var handler=require('./handler')

process.env.DB_ENDPOINT="127.0.0.1"
process.env.DB_USER="auth"
process.env.DB_PASSWORD=config.DBEncryptedPassword
process.env.DB_NAME='test'
process.env.KMS_KEY=config.keyArn

var username='johndoe'
var password='passowrd'

module.exports={
    setUp:function(callback){
        var connection=mysql.createConnection({
                host:process.env.DB_ENDPOINT,
                user:"root",
                password:config.DBPassword,
                multipleStatements:true
            })
        var client=new jsrp.client()  
        
        client.init({username:username,password:password},
            function(){client.createVerifier(function(err,result){
                connection.query(
                    [   
                        "CREATE DATABASE IF NOT EXISTS "+process.env.DB_NAME,
                        "CREATE USER IF NOT EXISTS `auth` IDENTIFIED BY '"+config.DBPassword+"'",
                        "CREATE TABLE IF NOT EXISTS `"+process.env.DB_NAME+"`.`users` (id text,salt text, verifier text,arn text)",
                        "GRANT SELECT ON `"+process.env.DB_NAME+"`.`users` TO auth",
                        "USE `"+process.env.DB_NAME+"`",
                        "INSERT INTO users VALUES ('"+username+"','"+result.salt+"','"+result.verifier+"','"+config.roleArn+"')"
                    ].join(';'),
                    function(err){
                        callback() 
                    }
                )
       })}) 
    },
    tearDown:function(callback){
        var connection=mysql.createConnection({
                host:process.env.DB_ENDPOINT,
                user:"root",
                password:config.DBPassword,
                multipleStatements:true
            })
        connection.query(
            [
                "DROP DATABASE IF EXISTS `"+process.env.DB_NAME+"`",
                "DROP USER IF EXISTS auth"
            ].join(';'),
            function(err){
                callback() 
            }
        )
        
        connection.end()
    },
    
    testsrp:function(test){
        test.expect(2);
       
        var client=new jsrp.client()  
        client.init({username:username,password:password},
        function(){
            var B = client.getPublicKey();
            
            srp.getSharedKey(B,username)
            .then(function(result){
                client.setSalt(result.salt);
                client.setServerPublicKey(result.publicKey);

                test.equal(
                    client.getSharedKey(),
                    result.sharedKey,
                    "Shared Key should be the same"
                )
                test.ok(result.arn)
                test.done()
            })
        })

    },

    testrole:function(test){
        test.expect(3);
        
        role.getCredentials(
            config.roleArn,
            username)
        .then(function(result){
            test.ok(result.AccessKeyId)
            test.ok(result.SecretAccessKey)
            test.ok(result.SessionToken)
            test.done()
        })
    },

    testlambda:function(test){
        test.expect(2);
        
        var client=new jsrp.client()  
        client.init({username:username,password:password},
        function(){
            var event={
                body:JSON.stringify(
                    {
                        user:username,
                        B:client.getPublicKey()
                    }
                )
            }
            var callback=function(err,data){
                test.ifError(err)
                test.ok(data)
                test.done()

            }
            handler.handler(event,null,callback)

        })            
    }
}




