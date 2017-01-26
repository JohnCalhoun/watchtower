process.env.REGION='us-east-1'
var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})

var config=require('../config.json')
var mysql=require('mysql')
var sql=require('sql')
var jsrp=require('jsrp')
var handler=require('./handler')
var ops=require('./operations.js')
var email=require('./email.js')
var connect=require('./connect.js')
var decrypt=require('./decrypt.js')
var keys=require('./testKeys.js')
var crypto=require('crypto')
var mfa=require('./mfa.js')
var speakeasy=require('speakeasy')
var role=require('./role.js')
var srp=require('./srp.js')
var auth=require('./auth.js')
var qr=require('qr-image')
var db=ops.db
var sign=require('./sign.js')

process.env.DB_ENDPOINT="127.0.0.1"
process.env.DB_USER="manage"
process.env.DB_NAME='test'
process.env.KMS_KEY=config.keyArn
process.env.EMAIL_SOURCE="test@jmc.ninja"
process.env.ROLE_ARN=config.roleArn

var username='johndoe'
var password='passowrd'

var encrypt_message=function(input){
    return new Promise(function(resolve,reject){
        keys(config.keyArn)
        .then(function(keypair){
            payload=JSON.stringify(input)
        
        //generate symetric key
            var pass=crypto.randomBytes(20).toString('hex')
            var algorithm='aes-256-ctr'
        
        //encrypt payload with symetric key
            var cipher = crypto.createCipher(algorithm,pass)
            var ciphertext = cipher.update(payload,'utf8','hex')
            ciphertext += cipher.final('hex');
        
        //encrypt symetric key with private key
            var cipherKey=crypto.publicEncrypt(keypair.publicKey,new Buffer(pass)).toString('base64')
            var body={payload:ciphertext,
                    key:cipherKey,
                    algorithm:algorithm}
            
            process.env.RSA_PRIVATE_KEY=keypair.privateKeyEncrypted
            process.env.RSA_KMS_KEY=config.keyArn

            resolve(body)
        },function(err){console.log(err)})
    })
}
var qrsecret

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
                var secret=speakeasy.generateSecret();
                var qrcode=qr.svgObject(secret.otpauth_url).path
                qrsecret=secret.base32

                connection.query(
                    [   
                        "CREATE DATABASE IF NOT EXISTS "+process.env.DB_NAME,
                        "CREATE USER IF NOT EXISTS `manage` IDENTIFIED BY '"+config.DBPassword+"'",
                        "USE `"+process.env.DB_NAME+"`",
                        ops.db.create().ifNotExists().toQuery().text,
                        "GRANT SELECT,INSERT,UPDATE,DELETE ON `users` TO manage",
                        ops.db.insert(
                            db.id.value(username),
                            db.email.value('johnmcalhoun123@gmail.com'),
                            db.salt.value(result.salt),
                            db.verifier.value(result.verifier),
                            db.type.value('admin'),
                            db.reset.value(false),
                            db.mfaSecret.value(secret.base32),
                            db.mfaQrcode.value(qrcode),
                            db.mfaEnabled.value(false)
                        ).toString()
                    ].join(';'),
                    function(err){
                        if(err)console.log('start error',err)
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
                if(err)console.log(err)
                callback() 
            }
        )
        
        connection.end()
    },
 
    testsrp:function(test){
        test.expect(1);
       
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
                test.done()
            },function(err){console.log(err)})
        })

    },

    testSign:function(test){
        keys(config.keyArn)
        .then(function(keypair){
            process.env.RSA_PRIVATE_KEY=keypair.privateKeyEncrypted
            var data={a:"b"}
            var callback=function(err,out){
                test.expect(2);
                test.ifError(err)
                
                verify = crypto.createVerify(out.hash);
                verify.update(out.result);

                test.ok(verify.verify(keypair.publicKey, out.signature,'hex'));
                test.done()
            }
            
            sign(data,callback)
        })
    }, 

    testMfa:function(test){
        mfa.gen(username)
        .then(function(){
            return mfa.get(username)
        })
        .then(function(results){
            var token=speakeasy.totp({
                secret:results.secret,
                encoding:'base32'
            })
            mfa.val(username,token)
            .then(function(result){
                test.expect(3);
                test.ok(results.secret) 
                test.ok(results.qr) 
                test.ok(result)
                test.done()
            })
        })
    },
  
    testLambdaMFACreate:function(test){
        encrypt_message({
            action:"createMFA",
            id:username
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },
 
    testLambdaMFAVal:function(test){
        encrypt_message({
            action:"valMFA",
            id:username,
            token:"111111"
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testEmail:function(test){
        test.expect(1);
        
        email.send("johnmcalhoun123@gmail.com",{secret:"asdfasdfasdfa"},"reset")
        .then(function(err){
            test.ifError(err)
            test.done()
        })
    },
   
    testLambdaGet:function(test){
        encrypt_message({
            action:"get",
            id:username
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.ok(data)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },
    
    testLambdaCreate:function(test){
        encrypt_message({
            action:"create",
            id:"bill",
            email:"johnmcalhoun123@gmail.com"
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testCreate:function(test){
        test.expect(1);
        
        ops.create("1","1308180","asdfasdfasdf","admin")
        .then(function(){
            test.ok(true)
            test.done()
        })
    },
    
    testLambdaRemove:function(test){
        encrypt_message({
            action:"delete",
            id:username
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testRemove:function(test){
        test.expect(1);
        
        ops.remove(username)
        .then(function(){
            test.ok(true)
            test.done()
        })
    },
 
    testLambdaChangePassword:function(test){
        encrypt_message({
            action:"changePassword",
            id:username,
            salt:"salt",
            verifier:"verifier"
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testLambdaChangeEmail:function(test){
        encrypt_message({
            action:"changeEmail",
            id:username,
            email:username
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testLambdaChangePassword:function(test){
        encrypt_message({
            action:"changePassword",
            id:username,
            salt:"salt",
            verifier:"verfife"
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testLambdaResetPassword:function(test){
        encrypt_message({
            action:"resetPassword",
            id:username
        })
        .then(function(text){
            var event={body:JSON.stringify(text)}

            var callback=function(err,data){
                test.ifError(err)
                test.done()
            }
            handler.handler(event,null,callback)
        },function(err){
            console.log(err)
            test.done()
        })
    },

    testUpdate:function(test){
        test.expect(1);
        
        ops.update(username,{email:"jerry"})
        .then(function(){
            test.ok(true)
            test.done()
        })
    },

    testGet:function(test){
        
        ops.get(username)
        .then(function(results){
            test.expect(2);
            test.ok(results)
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
                payload_object={
                            action:"get",
                            id:username,
                            verifier:client.getPublicKey()
                        }
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
                    test.equal(payload_object.id,data.id)
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
    },

    testrole:function(test){
        test.expect(3);
        role.getCredentials(username,"admin")
        .then(function(result){
            test.ok(result.AccessKeyId)
            test.ok(result.SecretAccessKey)
            test.ok(result.SessionToken)
            test.done()
        },function(err){
            console.log(err) 
        })
    },

    testAuth:function(test){
        var client=new jsrp.client()  
        client.init({username:username,password:password},
        function(){
            var token=speakeasy.totp({
                secret:qrsecret,
                encoding:'base32'
            })
            var B=client.getPublicKey()
           

            auth(username,B,token).then(
                function(results){
                    test.expect(4);
                    test.ok(results.salt,"should return salt")
                    test.ok(results.algorithm,"should return algorithm")
                    test.ok(results.A,"should return A")
                    test.ok(results.credentials,"should return credentials")
                    test.done()
                },
                function(err){
                    test.expect(1);
                    test.ifError(err)
                    test.done()
                }
            )
        })
    },

    testLambdaAuth:function(test){
        var client=new jsrp.client()  
        client.init({username:username,password:password},
            function(){
            encrypt_message({
                action:"auth",
                id:username,
                B:client.getPublicKey(),
                token:null
            })
            .then(function(text){
                var event={body:JSON.stringify(text)}

                var callback=function(err,data){
                    test.ifError(err)
                    test.done()
                }
                handler.handler(event,null,callback)
            },function(err){
                console.log(err)
                test.done()
            })
        })
    }
}




