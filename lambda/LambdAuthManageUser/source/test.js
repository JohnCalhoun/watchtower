process.env.REGION='us-east-1'
var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})


var config=require('../config.json')
var mysql=require('mysql')
var jsrp=require('jsrp')
var handler=require('./handler')
var ops=require('./operations.js')
var email=require('./email.js')
var connect=require('./connect.js')
var decrypt=require('./decrypt.js')
var keys=require('./testKeys.js')
var crypto=require('crypto')

process.env.DB_ENDPOINT="127.0.0.1"
process.env.DB_USER="manage"
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
                        "CREATE USER IF NOT EXISTS `manage` IDENTIFIED BY '"+config.DBPassword+"'",
                        "CREATE TABLE IF NOT EXISTS `"+process.env.DB_NAME+"`.`users` (id text,salt text, verifier text,arn text)",
                        "GRANT SELECT ON `"+process.env.DB_NAME+"`.`users` TO manage",
                        "USE `"+process.env.DB_NAME+"`",
                        "INSERT INTO users VALUES ('"+username+"','"+result.salt+"','"+result.verifier+"','"+config.roleArn+"')"
                    ].join(';'),
                    function(err){
                        kms.encrypt({
                            KeyId:process.env.KMS_KEY,
                            Plaintext:config.DBPassword,
                            EncryptionContext:{
                                user:'manage' 
                            }
                        },function(err,data){
                            process.env.DB_PASSWORD=data.CiphertextBlob.toString('base64')
                            callback() 
                        })
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
                "DROP USER IF EXISTS manage"
            ].join(';'),
            function(err){
                callback() 
            }
        )
        
        connection.end()
    },
   
    testCreate:function(test){
        test.expect(1);
        
        ops.create()
        .then(function(){
            test.ok(true)
            test.done()
        })
    },
   
    testRemove:function(test){
        test.expect(1);
        
        ops.remove()
        .then(function(){
            test.ok(true)
            test.done()
        })
    },

    testChangePassword:function(test){
        test.expect(1);
        
        ops.changePassword()
        .then(function(){
            test.ok(true)
            test.done()
        })
    },

    testChangeId:function(test){
        test.expect(1);
        
        ops.changeId()
        .then(function(){
            test.ok(true)
            test.done()
        })
    },

    testGet:function(test){
        
        ops.get(username)
        .then(function(results){
            test.expect(3);
            test.ok(results)
            test.ok(results.salt)
            test.equal(results.id,username)
            test.done()
        },
        function(err){
            test.expect(1);
            test.ifError(err);
            test.done()
        }
        )
    },

    testEmail:function(test){
        test.expect(1);
        
        email.send()
        .then(function(){
            test.ok(true)
            test.done()
        })
    },
    
    testConnect:function(test){
        
        connect()
        .then(function(con){
            test.expect(1);
            test.ok(con)
            con.end()
            test.done()
        },
        function(err){
            test.expect(1);
            test.ifError(err);
            test.done()
        })
    },

    testDecrypt:function(test){
        
        keys(config.keyArn)
        .then(function(keypair){
            var client=new jsrp.client()  
            client.init({username:username,password:password},
            function(){
                payload_object=JSON.stringify({
                            user:username,
                            verifiver:client.getPublicKey()
                        })
                payload=JSON.stringify(payload_object)

                //generate symetric key
                var pass=crypto.randomBytes(20).toString('hex')
                var algorithm='aes-256-ctr'

                //encrypt payload with symetric key
                var cipher = crypto.createCipher(algorithm,pass)
                var ciphertext = cipher.update(payload,'utf8','hex')
                ciphertext += cipher.final('hex');

                //encrypt symetric key with private key
                var cipherKey=crypto.publicEncrypt(keypair.publicKey,new Buffer(pass)).toString('base64')

                var body={
                        payload:ciphertext,
                        key:cipherKey,
                        algorithm:algorithm
                    }

                process.env.RSA_PRIVATE_KEY=keypair.privateKeyEncrypted
                process.env.RSA_KMS_KEY=config.keyArn
                
                decrypt(body)
                .then(function(data){
                    test.expect(2);
                    test.equal(payload_object.user,data.user)
                    test.equal(payload_object.verifiver,data.verifiver)
                    test.done()
                },
                function(err){
                    test.expect(1);
                    test.ifError(err);
                    test.done()
                })
            })
        })
    }
}




