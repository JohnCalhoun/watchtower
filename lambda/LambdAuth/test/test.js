process.env.REGION='us-east-1'

var aws=require('aws-sdk')

var kms=new aws.KMS({region:process.env.REGION})

var mysql=require('mysql')
var sql=require('sql')
var jsrp=require('jsrp')
var crypto=require('crypto')
var speakeasy=require('speakeasy')
var qr=require('qr-image')
var keys=require('./testKeys.js')

var require_helper=require('./require_helper.js')
var config=require('./config.json')

var handler=require_helper('handler.js')
var ops=require_helper('operations.js')
var email=require_helper('email.js')
var connect=require_helper('connect.js')
var decrypt=require_helper('decrypt.js')
var mfa=require_helper('mfa.js')
var role=require_helper('role.js')
var srp=require_helper('srp.js')
var session=require_helper('session.js')
var sign=require_helper('sign.js')
var KMS=require_helper('KMS.js')

var db=ops.db
process.env.KMS_KEY=config.keyArn
process.env.RSA_KMS_KEY=config.keyArn
process.env.ROLE_ARN=config.roleArn
process.env.EMAIL_SOURCE="test@jmc.ninja"
process.env.LOG_LEVEL='warn'

validate=require('jsonschema').validate
messageschema=require(__dirname+'/../source/assets/messageschema.json')

var username='johndoe'
var password='passowrd'

var key_promise=keys(config.keyArn)
var password_promise=new Promise(function(resolve,reject){
    kms.encrypt({
        KeyId:process.env.KMS_KEY,
        Plaintext:config.DBPassword,
        EncryptionContext:{
            user:'manage' 
        }
    },function(err,data){
        if(err){
            reject(err)
        }else{
            resolve(data.CiphertextBlob.toString('base64'))
        }
    })
})

var verifier_promise=new Promise(function(resolve,reject){
   var client=new jsrp.client()  
    
    client.init({username:username,password:password},
        function(){
            client.createVerifier(function(err,result){
                if(err){reject(err)}else{
                    resolve({
                        salt:result.salt,
                        verifier:result.verifier,
                        B:client.getPublicKey()
                    })
                }
            })
        }
    )
})
module.exports={
    KMS:{
        Encrypt:function(test){
            test.expect(1)
            KMS.encrypt("test")
            .then(function(cipher){
                test.ok(cipher.toString("base32"))
                test.done()
            })
        },
        
        EncryptFail:function(test){
            test.expect(1)
            process.env.KMS_KEY="adf"
            KMS.encrypt("test")
            .then(null,function(err){
                process.env.KMS_KEY=config.keyArn
                test.ok(err)
                test.done()
            })
        },
        
        Decrypt:function(test){
            test.expect(1)
            var text="test"

            KMS.encrypt(text)
            .then(function(cipher){
                KMS.decrypt(cipher)
                .then(function(result){
                    test.equal(text,result)
                    test.done()
                })
            })
        }
    },
    Handler:{
        Error:function(test){ 
            var callback=function(err){
                test.expect(1)
                test.ok(err)
                test.done()
            }
            handler.Error(callback)("you should see this")
        },
        Success:function(test){ 
            var callback=function(err){
                test.expect(1)
                test.ifError(err)
                test.done()
            }
            handler.Success(callback)("you should not see this")
        }
    },
    log:function(test){
        var log=require_helper('log.js')
        log.log("you should see this",log.levels.error)  
        log.log("you should not see this",log.levels.info)  
        test.done()
    },
    role:function(test){
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
    Decrypt:{
        Skip:function(test){
           var message={
                id:'john',
                token:'111111',
                B:crypto.randomBytes(4096).toString('hex')
            }
            decrypt(message)
            .then(function(data){
                test.expect(2);
                test.ok(data)
                test.equal(data.action,'session')
                test.done()
            },
            function(err){
                test.expect(1);
                test.ifError(err,"should not return erro");
                test.done()
            })
        },
        Success:function(test){
            key_promise.then(function(keypair){
                var client=new jsrp.client()  
                client.init({username:username,password:password},
                function(){
                    payload_object={
                                action:"changePassword",
                                id:username,
                                verifier:client.getPublicKey(),
                                salt:crypto.randomBytes(4096).toString('hex')
                            }
                    payload=JSON.stringify(payload_object)

                    //generate symetric key
                    var pass=crypto.randomBytes(20).toString('hex')
                    var algorithm='aes-256-cbc-hmac-sha256'

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
                        console.log(err)
                        test.expect(1);
                        test.ifError(err);
                        test.done()
                    })
                })
            })
        },
        Fail1:function(test){
            test.expect(1);
            process.env.RSA_PRIVATE_KEY=""
            
            decrypt("")
            .then(null,
            function(err){
                test.ok(err);
                test.done()
            })
        },
        Fail2:function(test){
            key_promise.then(function(keypair){
                process.env.RSA_PRIVATE_KEY=keypair.privateKeyEncrypted
         
                decrypt("")
                .then(null,
                function(err){
                    test.ok(err);
                    test.done()
                })
            })
        }
    },
    Email:function(test){
        test.expect(1);
        
        email.send("johnmcalhoun123@gmail.com",{secret:"asdfasdfasdfa"},"reset")
        .then(function(err){
            test.ifError(err)
            test.done()
        })
    },
    
    EmailFail1:function(test){
        test.expect(1);
        
        email.send("johnmcalhoun123@gmail.com",{secret:"asdfasdfasdfa"},"NotATYPE")
        .then(null,function(err){
            test.ok(err)
            test.done()
        })

    },
    
    EmailFail2:function(test){
        test.expect(1);
        var save=process.env.EMAIL_SOURCE="test@jmc.ninja"
        process.env.EMAIL_SOURCE="notvalid"
        
        email.send("johnmcalhoun123@gmail.com",{secret:"asdfasdfasdfa"},"reset")
        .then(null,function(err){
            test.ok(err)
            process.env.EMAIL_SOURCE=save
            test.done()
        })

    },

    Validate:{
        Create:function(test){
            test.expect(2)
            test.ok(validate({
                action:"create",
                id:"john",
                email:"john@johnmcalhoun.com",
                B:crypto.randomBytes(4096).toString('hex'),
                group:"user"
            },messageschema).valid,"accept proper create")
            
            test.ok(!validate({
                action:"create",
                id:"john",
                B:"11",
                group:"user"
            },messageschema).valid,"reject invalid create")
            
            test.done()
        },
        Delete:function(test){
            test.expect(2)
            test.ok(validate({
                action:"delete",
                id:"john"
            },messageschema).valid,"accept proper delete")
            
            test.ok(!validate({
                action:"Delete",
                id:"john"
            },messageschema).valid,"reject invalid delete")
            
            test.done()
        },
        session:function(test){
            test.expect(2)
            test.ok(validate({
                action:"session",
                id:"john",
                B:crypto.randomBytes(4096).toString('hex'),
                token:"111111"
            },messageschema).valid,"accept proper session")
            
            test.ok(!validate({
                action:"session",
                id:"john",
                B:"11",
                token:"11"
            },messageschema).valid,"reject invalid session")
            
            test.done()
        },
        changeEmail:function(test){
            test.expect(2)
            test.ok(validate({
                action:"changeEmail",
                id:"john",
                email:"john@m.com"
            },messageschema).valid,"accept proper changeEmail")
            
            test.ok(!validate({
                action:"changeEmail",
                id:"john",
                email:"johnm.com"
            },messageschema).valid,"reject invalid changeEmail")
            
            test.done()
        },
        get:function(test){
            test.expect(2)
            test.ok(validate({
                action:"delete",
                id:"john"
            },messageschema).valid,"accept proper get")
            
            test.ok(!validate({
                action:"delete",
                id:"john",
                email:"johnm.com"
            },messageschema).valid,"reject invalid get")
            
            test.done()
        },
        changePassword:function(test){
            test.expect(2)
            test.ok(validate({
                action:"changePassword",
                id:"john",
                salt:crypto.randomBytes(32).toString('hex'),
                verifier:crypto.randomBytes(4096).toString('hex')
            },messageschema).valid,"accept proper changePassword")
            
            test.ok(!validate({
                action:"changePassword",
                id:"john",
                email:"johnm.com"
            },messageschema).valid,"reject invalid changePassword")
            
            test.done()
        }

    },

    DB:{
        setUp:function(callback){
            process.env.DB_ENDPOINT="127.0.0.1"
            process.env.DB_USER="manage"
            process.env.DB_NAME='test'

            var connection=mysql.createConnection({
                    host:process.env.DB_ENDPOINT,
                    user:"root",
                    password:config.DBPassword,
                    multipleStatements:true
                })
            verifier_promise.then(function(result){
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
                                db.mfaSecret.value(null),
                                db.mfaEnabled.value(false)
                            ).toString()
                        ].join(';'),
                        function(err){
                            if(err)console.log(err)
                            password_promise.then(function(password){
                                connection.end()
                                process.env.DB_PASSWORD=password
                                callback()
                            })
                        }
                    )
           }) 
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
                    connection.end()
                    callback() 
                }
            )
        },

        Sign:function(test){
            key_promise.then(function(keypair){
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
                
                sign(data,callback,{id:username,B:"ad"})
            })
        }, 

        Mfa:function(test){
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
                    test.ok(results.secret,"should return secret") 
                    test.ok(results.qr,"should return qr") 
                    test.ok(result,'should return something')
                    test.done()
                })
            })
        },
     
        Mfa2:function(test){
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
                     var token=speakeasy.totp({
                        secret:results.secret,
                        encoding:'base32'
                    })
                    mfa.auth(username,token)
                    .then(function(result){
                        test.expect(1)
                        test.ok(result)
                        test.done()
                    },function(err){
                        test.expect(1)
                        test.ifError(err)
                        test.done()
                    })
                })
            })
        },
        Remove:function(test){
            test.expect(1);
            
            ops.remove(username)
            .then(function(){
                test.ok(true)
                test.done()
            })
        },

        
     
        Create:function(test){
            test.expect(1);
            
            ops.create("1","1308180","asdfasdfasdf","admin")
            .then(function(){
                test.ok(true)
                test.done()
            })
        },
     
        Update:function(test){
            test.expect(1);
            
            ops.update(username,{email:"jerry"})
            .then(function(){
                test.ok(true)
                test.done()
            })
        },

        Get:function(test){
            
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
        
        Connect:function(test){
            test.expect(1);
            
            connect()
            .then(function(con){
                test.ok(con)
                con.end()
                test.done()
            })
        },
 
        ConnectFail1:function(test){
            test.expect(1);
            
            process.env.DB_USER="incorret"
            connect()
            .then(null,
            function(err){
                test.ok(err);
                test.done()
            })
        },
 
        ConnectFail2:function(test){
            test.expect(1);
            
            process.env.DB_ENDPOINT="incorret"
            connect()
            .then(null,
            function(err){
                test.ok(err);
                test.done()
            })
        },
        Session:{ 
            Success:function(test){
                var client=new jsrp.client()  
                client.init({username:username,password:password},
                function(){
                    mfa.gen(username)
                    .then(function(){
                        return mfa.get(username)
                    })
                    .then(function(results){
                        var token=speakeasy.totp({
                            secret:results.secret,
                            encoding:'base32'
                        })
                        var B=client.getPublicKey()

                        session(username,B,token).then(
                            function(results){
                                test.expect(1);
                                test.ok(results)
                                test.done()
                            },
                            function(err){
                                test.expect(1);
                                test.ifError(err)
                                test.done()
                            }
                        )
                    })
                })
            },
            Fail:function(test){
                mfa.gen(username)
                .then(function(){
                    return(ops.update(username,{mfaEnabled:true}))
                })
                .then(function(){
                    return(session(username,"1","111111"))
                })     
                .then(function(results){
                        test.expect(1);
                        test.ok(!results)
                        test.done()
                    }
                )  
            }
        },
        Lambda:{
            setUp:function(callback){
                key_promise.then(function(keypair){
                    process.env.RSA_PRIVATE_KEY=keypair.privateKeyEncrypted
                    callback() 
                })
            },
            
            LambdaMFACreate:function(test){
                var message={
                    action:"createMFA",
                    id:username,
                    token:"111111",
                    B:"ad"
                }
                var callback=function(err){
                    test.ifError(err)
                    test.done()
                }
                handler.actions.createMFA(message,callback)
            },
         
            LambdaMFAVal:function(test){
                var message={
                    action:"valMFA",
                    id:username,
                    token:"111111"
                }
                var callback=function(err){
                    test.ifError(err)
                    test.done()
                }
                
                mfa.gen(username)
                .then(function(){
                    handler.actions.valMFA(message,callback)
                })
            },
          
            LambdaGet:function(test){
                var message={
                    action:"get",
                    id:username,
                    B:"ad"
                }           
                var callback=function(err,data){
                    test.ifError(err)
                    test.ok(data)
                    test.done()
                }
                handler.actions.get(message,callback)
            },
            
            LambdaCreate:function(test){
                var message={
                    action:"create",
                    id:"bill",
                    email:"johnmcalhoun123@gmail.com",
                    token:"111111",
                    B:"aa"
                }
                var callback=function(err,data){
                    test.ifError(err)
                    test.done()
                }
                
                handler.actions.create(message,callback)
            },
          
            LambdaRemove:function(test){
                var message={
                    action:"delete",
                    id:username
                }
                var callback=function(err,data){
                    test.ifError(err)
                    test.done()
                }
                
                handler.actions.delete(message,callback)
                
            },

         
            LambdaChangeEmail:function(test){
                var message={
                    action:"changeEmail",
                    id:username,
                    email:"test@test.com"
                }
                
                var callback=function(err,data){
                    test.ifError(err)
                    test.done()
                }
                
                handler.actions.changeEmail(message,callback)
            },

            LambdaChangePassword:function(test){
                var message={
                    action:"changePassword",
                    id:username,
                    salt:crypto.randomBytes(4096).toString('hex'),
                    verifier:crypto.randomBytes(4096).toString('hex')
                }
                var callback=function(err,data){
                    test.ifError(err)
                    test.done()
                }

                handler.actions.changePassword(message,callback)
            },

            LambdaResetPassword:function(test){
                var message={
                    action:"resetPassword",
                    id:username
                }
                var callback=function(err,data){
                    test.ifError(err)
                    test.done()
                }
                handler.actions.resetPassword(message,callback)
            },
            LambdaSession:function(test){
                var client=new jsrp.client()  
                client.init({username:username,password:password},
                    function(){
                        mfa.gen(username)
                        .then(function(){
                            return mfa.get(username)
                        })
                        .then(function(results){
                            var token=speakeasy.totp({
                                secret:results.secret,
                                encoding:'base32'
                            })

                            var message={
                                action:"session",
                                id:username,
                                B:client.getPublicKey(),
                                token:token
                            }

                            var callback=function(err,data){
                                test.ifError(err)
                                test.done()
                            }
                            handler.actions.session(message,callback)
                        })
                })
            },
            Handler:function(test){
                key_promise.then(function(keypair){
                    payload_object={
                                action:"get",
                                id:username,
                                B:crypto.randomBytes(4096).toString('hex')
                            }
                    payload=JSON.stringify(payload_object)

                    //generate symetric key
                    var pass=crypto.randomBytes(20).toString('hex')
                    var algorithm='aes-256-cbc-hmac-sha256'

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
                    
                    var event={
                        body:JSON.stringify(body)
                    }

                    callback=function(err,data){
                        if(err)console.log(err)
                        test.expect(1);
                        test.ifError(err)
                        test.done()
                    }
                    
                    handler.handler(event,null,callback)
                }
            )
        }
        }
    }
}




