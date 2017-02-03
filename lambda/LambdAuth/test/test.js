process.env.REGION='us-east-1'
process.env.AWS_LAMBDA_FUNCTION_NAME='test' 
process.env.LAMBDA_WAIT_TIME='2' 

var aws=require('aws-sdk')
var Promise=require('bluebird')
var kms=new aws.KMS({region:process.env.REGION})

var mysql=require('mysql')
var sql=require('sql')
var crypto=require('crypto')
var speakeasy=require('speakeasy')
var qr=require('qr-image')
var keys=require('./testKeys.js')

var require_helper=require('./require_helper.js')
var config=require('./config.json')

var SRPClient = require_helper('SRP/client.js')('modp18',1024);
var SRP = require_helper('SRP/srp.js')('modp18',1024,64)
var srp = require_helper('srp.js');

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
var log=require_helper('log.js')

var db=ops.db
process.env.KMS_KEY=config.keyArn
process.env.RSA_KMS_KEY=config.keyArn
process.env.ROLE_ARN=config.roleArn
process.env.EMAIL_SOURCE="test@jmc.ninja"
process.env.LOG_LEVEL='Warn'

validate=require('jsonschema').validate
messageschema=require(__dirname+'/../source/assets/messageschema.json')
lambdaOutSchema=require('./lambdaOutSchema.json')

var faker=require('faker')
var username=faker.internet.userName()
var password=faker.internet.password()


var key_promise=keys(config.keyArn)

var verifier_promise=new Promise(function(resolve,reject){
    var SRP = require_helper('SRP/srp.js')('modp18',1024,64)
    var client = require_helper('SRP/client.js')('modp18',1024,64)
    var srp = require_helper('srp.js');
    
    var material=srp.genVerifier(username,password) 
    var A=client.genA()
    
    resolve({
        salt:material.salt.toString('hex'),
        verifier:material.v.toString('hex'),
        A:A.A
    })
})
module.exports={
    KMS:{
        Encrypt:function(test){
            test.expect(1)
            var text=faker.lorem.word()
            KMS.encrypt(text)
            .then(function(cipher){
                test.ok(cipher.toString("base32"))
            })
            .finally(test.done)
        },
        
        EncryptFail:function(test){
            test.expect(1)
            process.env.KMS_KEY="adf"
            var text=faker.lorem.word()
            KMS.encrypt(text)
            .then(null,function(err){
                process.env.KMS_KEY=config.keyArn
                test.ok(err)
            })
            .finally(test.done)
        },
        
        Decrypt:function(test){
            test.expect(1)
            var text=faker.lorem.word()

            KMS.encrypt(text)
            .then(function(cipher){
                return KMS.decrypt(cipher)
            })
            .then(function(result){
                test.equal(text,result)
            })
            .finally(test.done)
        }
    },
    Log:{
        log:function(test){
            log.log("you should see this","Error")  
            log.log("you should not see this","Info")  
            test.done()
        },
        action:function(test){
            test.expect(1)
            
            log.action('test')
            .then(function(){
                test.ok(true)
            })
            .finally(test.done)
        },
        time:function(test){
            test.expect(1)
            var infos=[]
            var start=process.hrtime()

            infos.push({name:'example',time:process.hrtime(start)})
            
            log.times(infos)
            .then(function(){
                test.ok(true)
            })
            .finally(test.done)
        }
    },
    role:function(test){
        test.expect(3);
        role.getCredentials(username,"admin",true)
        .then(function(result){
            test.ok(result.AccessKeyId)
            test.ok(result.SecretAccessKey)
            test.ok(result.SessionToken)
        },function(err){
            console.log(err) 
        })
        .finally(test.done)
    },
    Decrypt:{
        Skip:function(test){
           var message={
                id:faker.internet.userName(),
                token:'111111',
                B:crypto.randomBytes(4096).toString('hex'),
                messageId:"addd",
                hotp:"1241314da"
            }
            decrypt(message)
            .then(function(data){
                test.expect(2);
                test.ok(data)
                test.equal(data.action,'session')
            },
            function(err){
                test.expect(1);
                test.ifError(err,"should not return erro");
            })
            .finally(test.done)
        },
        Success:function(test){
            Promise.all([key_promise,verifier_promise])
            .then(function(material){
                payload_object={
                            action:"changePassword",
                            id:username,
                            verifier:material[1].A,
                            salt:crypto.randomBytes(4096).toString('hex')
                        }
                payload=JSON.stringify(payload_object)

                //generate symetric key
                var iv=crypto.randomBytes(64).toString('hex')
                var pass=crypto.randomBytes(20).toString('hex')
                var algorithm='aes-256-gcm'

                //encrypt payload with symetric key
                var cipher = crypto.createCipher(algorithm,pass,iv)
                
                var ciphertext = cipher.update(payload,'utf8','hex')
                ciphertext += cipher.final('hex');

                //encrypt symetric key with private key
                var cipherKey=crypto.publicEncrypt(material[0].publicKey,new Buffer(pass)).toString('base64')

                var body={
                        payload:ciphertext,
                        key:cipherKey,
                        algorithm:algorithm,
                        iv:iv,
                        tag:cipher.getAuthTag().toString('hex')
                    }

                process.env.RSA_PRIVATE_KEY=material[0].privateKeyEncrypted
                process.env.RSA_PUBLIC_KEY=material[0].publicKey
                process.env.RSA_KMS_KEY=config.keyArn

                decrypt(body)
                .then(function(data){
                    test.expect(2);
                    test.equal(payload_object.id,data.id)
                    test.equal(payload_object.verifiver,data.verifiver)
                },
                function(err){
                    console.log(err)
                    test.expect(1);
                    test.ifError(err);
                })
                .finally(test.done)
            })
        }
    },
    Email:function(test){
        test.expect(1);
        
        email.send("johnmcalhoun123@gmail.com",{secret:faker.internet.password()},"reset")
        .then(function(err){
            test.ifError(err)
        })
        .finally(test.done)
    },
    
    EmailFail1:function(test){
        test.expect(1);
        
        email.send("johnmcalhoun123@gmail.com",{secret:faker.internet.password()},"NotATYPE")
        .then(null,function(err){
            test.ok(err)
        })
        .finally(test.done)

    },
    
    EmailFail2:function(test){
        test.expect(1);
        var save=process.env.EMAIL_SOURCE="test@jmc.ninja"
        process.env.EMAIL_SOURCE="notvalid"
        
        email.send("johnmcalhoun123@gmail.com",{secret:faker.internet.password()},"reset")
        .then(null,function(err){
            test.ok(err)
            process.env.EMAIL_SOURCE=save
        })
        .finally(test.done)

    },

    Validate:{
        Create:function(test){
            test.expect(2)
            test.ok(validate({
                action:"create",
                id:faker.internet.userName(),
                newId:faker.internet.userName(),
                email:faker.internet.email(),
                B:crypto.randomBytes(4096).toString('hex'),
                group:"user",
                messageId:"addd",
                hotp:"1241314da"
            },messageschema).valid,"accept proper create")
            
            test.ok(!validate({
                action:"create",
                id:faker.internet.userName(),
                B:"11",
                group:"user"
            },messageschema).valid,"reject invalid create")
            
            test.done()
        },
        Delete:function(test){
            test.expect(2)
            test.ok(validate({
                action:"delete",
                id:faker.internet.userName()
            },messageschema).valid,"accept proper delete")
            
            test.ok(!validate({
                action:"Delete",
                id:faker.internet.userName()
            },messageschema).valid,"reject invalid delete")
            
            test.done()
        },
        session:function(test){
            test.expect(2)
            
            var data={
                action:"session",
                id:faker.internet.userName(),
                B:crypto.randomBytes(4096).toString('hex'),
                token:"111111",
                messageId:"addd",
                hotp:crypto.randomBytes(1024).toString('hex')
            }
            test.ok(validate(data,messageschema).valid,"accept proper session")
            
            test.ok(!validate({
                action:"session",
                id:faker.internet.userName(),
                B:"11",
                token:"11"
            },messageschema).valid,"reject invalid session")
            
            test.done()
        },
        changeEmail:function(test){
            test.expect(2)
            test.ok(validate({
                action:"changeEmail",
                id:faker.internet.userName(),
                email:faker.internet.email()
            },messageschema).valid,"accept proper changeEmail")
            
            test.ok(!validate({
                action:"changeEmail",
                id:faker.internet.userName(),
                email:"johnm.com"
            },messageschema).valid,"reject invalid changeEmail")
            
            test.done()
        },
        get:function(test){
            test.expect(2)
            test.ok(validate({
                action:"delete",
                id:faker.internet.userName()
            },messageschema).valid,"accept proper get")
            
            test.ok(!validate({
                action:"delete",
                id:faker.internet.userName(),
                email:"johnm.com"
            },messageschema).valid,"reject invalid get")
            
            test.done()
        },
        changePassword:function(test){
            test.expect(2)
            test.ok(validate({
                action:"changePassword",
                id:faker.internet.userName(),
                salt:crypto.randomBytes(32).toString('hex'),
                verifier:crypto.randomBytes(4096).toString('hex')
            },messageschema).valid,"accept proper changePassword")
            
            test.ok(!validate({
                action:"changePassword",
                id:faker.internet.userName(),
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
            process.env.DB_PASSWORD=config.DBPassword

            var connection=mysql.createConnection({
                    host:process.env.DB_ENDPOINT,
                    user:"root",
                    password:config.DBPassword,
                    multipleStatements:true
                })
            verifier_promise.then(function(result){
                    connection.query(
                        [   
                            "DROP DATABASE IF EXISTS `"+process.env.DB_NAME+"`",
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
                            connection.end()
                            if(err)console.log(err)
                            callback()
                        }
                    )
           }) 
        },
        srp:function(test){
            verifier_promise.then(function(result){
                
                var hotp=SRPClient.getHotp(username,password,result.salt)
                var A=SRP.A(64)

                return srp.getSharedKey(A,username,hotp)
            })
            .then(function(result){
                test.ok(result.b)
                test.ok(result.B)
                test.ok(result.key)
            })
            .finally(test.done)
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

        Sign:{
            message:function(test){
                var publicKey
                Promise.all([verifier_promise,key_promise])
                .then(function(result){
                    process.env.RSA_PRIVATE_KEY=result[1].privateKeyEncrypted
                    publicKey=result[1].publicKey
                    var data={a:"b"}
                     
                    var SRPClient = require_helper('SRP/client.js')('modp18',1024);
                    var hotp=SRPClient.getHotp(username,password,result[0].salt)

                    return sign(data,{id:username,B:"ad",hotp:hotp,messageId:"100"})
                })
                .then(function(out){
                    test.ok(validate(out,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
            noMessage:function(test){
                var data={a:"b"}
                sign(data,null)
                .then(function(out){
                    test.ok(validate(out,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            }
        },
        Mfa:function(test){
            test.expect(3);
            mfa.gen(username)
            .then(function(){
                return mfa.get(username)
            })
            .then(function(results){
                var token=speakeasy.totp({
                    secret:results.secret,
                    encoding:'base32'
                })
                test.ok(results.secret,"should return secret") 
                test.ok(results.qr,"should return qr") 
                return mfa.val(username,token)
            })
            .then(function(result){
                test.ok(result,'should return something')
            })
            .finally(test.done)
        },
     
        Mfa2:function(test){
            var secret
            mfa.gen(username)
            .then(function(){
                return mfa.get(username)
            })
            .then(function(results){
                secret=results.secret
                var token=speakeasy.totp({
                    secret:secret,
                    encoding:'base32'
                })
                return mfa.val(username,token)
            })
            .then(function(result){
                 var token=speakeasy.totp({
                    secret:secret,
                    encoding:'base32'
                })
                return mfa.auth(username,token)
            })
            .then(function(result){
                test.expect(1)
                test.ok(result)
            },function(err){
                test.expect(1)
                test.ifError(err)
            })
            .finally(test.done)
        },
        Remove:function(test){
            test.expect(1);
            
            ops.remove(username)
            .then(function(){
                test.ok(true)
            })
            .finally(test.done)
        },
     
        Create:function(test){
            test.expect(1);
            
            ops.create(faker.internet.userName(),faker.internet.email(),"1308180","asdfasdfasdf","admin")
            .then(function(){
                test.ok(true)
            })
            .finally(test.done)
        },
     
        Update:function(test){
            test.expect(1);
            
            ops.update(username,{email:faker.internet.email()})
            .then(function(){
                test.ok(true)
            })
            .finally(test.done)
        },
        check:{
            found:function(test){
                test.expect(1);
                ops.check({id:username})
                .then(function(results){
                    test.ok(results)
                },
                function(err){
                    test.ifError(err);
                })
                .finally(test.done)
            },
            missing:function(test){
                test.expect(1);
                var tmp=ops.check({id:username+'not_here'})
                tmp.then(function(results){
                    test.ok(!results)
                },
                function(err){
                    test.ok(err);
                })
                .finally(test.done)
            }
        },
        Get:function(test){
            
            ops.get(username)
            .then(function(results){
                test.expect(2);
                test.ok(results)
                test.equal(results.id,username)
            },
            function(err){
                test.expect(1);
                test.ifError(err);
            })
            .finally(test.done)
        },
        
        Connect:function(test){
            test.expect(1);
            connect()
            .then(function(con){
                con.end()
                test.ok(con)
            })
            .finally(test.done)
        },
 
        ConnectFail1:function(test){
            test.expect(1);
            
            process.env.DB_USER="incorret"
            connect()
            .then(null,
            function(err){
                test.ok(err);
            })
            .finally(test.done)
        },
 
        ConnectFail2:function(test){
            test.expect(1);
            
            process.env.DB_ENDPOINT="incorret"
            connect()
            .then(null,
            function(err){
                test.ok(err);
            })
            .finally(test.done)
        },
        Session:{ 
            Success:function(test){
                
                mfa.gen(username)
                .then(function(){
                    return Promise.join(
                        verifier_promise,mfa.get(username),
                        function(material,results){
                            return {secret:results.secret,A:material.A} 
                        } 
                    )
                })
                .then(function(results){
                    var token=speakeasy.totp({
                        secret:results.secret,
                        encoding:'base32'
                    })
                    var B=results.A

                    return session(username,B,token)
                })
                .then(function(results){
                    test.expect(1);
                    test.ok(results)
                },
                function(err){
                    test.expect(1);
                    test.ifError(err)
                })
                .finally(test.done)
            },
            Fail:function(test){
                mfa.gen(username)
                .then(function(){
                    return(ops.update(username,{mfaEnabled:true}))
                })
                .then(function(){
                    return(session(username,"1","111111"))
                })     
                .then(null,function(results){
                    test.ok(results)
                })  
                .finally(test.done)
            }
        },
        Lambda:{
            setUp:function(callback){
                Promise.all([key_promise])
                .then(function(results){
                    process.env.RSA_PRIVATE_KEY=results[0].privateKeyEncrypted
                    callback() 
                })
            },
            
            MFACreate:function(test){
                test.expect(1)

                Promise.all([verifier_promise])
                .then(function(results){
                    var message={
                        action:"createMFA",
                        id:username,
                        token:"111111",
                        B:"ad",
                        messageId:"addd",
                        hotp:SRPClient.getHotp(username,password,results[0].salt)
                    }
                    return handler.actions.createMFA(message)
                })
                .then(function(out){
                    test.ok(validate(out,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
         
            MFAVal:function(test){
                test.expect(1)
                var message={
                    action:"valMFA",
                    id:username,
                    token:"111111"
                }
                
                mfa.gen(username)
                .then(function(){
                    return handler.actions.valMFA(message)
                })
                .then(function(out){
                    test.ok(validate(out,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
          
            Get:function(test){
                test.expect(1)
                Promise.all([verifier_promise])
                .then(function(results){

                    var message={
                        action:"get",
                        id:username,
                        B:"ad",
                        hotp:SRPClient.getHotp(username,password,results[0].salt),
                        messageId:"addd"
                    }           
                    
                    return handler.actions.get(message)
                })
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
             
            Salt:function(test){
                test.expect(2)
                var message={
                    action:"salt",
                    id:username
                }           

                var messagefalse={
                    action:"salt",
                    id:username+'notreal'
                }
                if(!process.env.RSA_PUBLIC_KEY)process.env.RSA_PUBLIC_KEY="dumbyvalue"
                var success=handler.actions.salt(message)
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })

                var missing=handler.actions.salt(messagefalse)
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                
                Promise.all([success,missing]).finally(test.done)
            },
           
            Create:function(test){
                test.expect(1)
                Promise.all([verifier_promise])
                .then(function(results){

                    var message={
                        action:"create",
                        id:username,
                        newId:"bill",
                        email:"johnmcalhoun123@gmail.com",
                        token:"111111",
                        B:"aa",
                        messageId:"addd",
                        hotp:SRPClient.getHotp(username,password,results[0].salt)
                    }
                    
                    return handler.actions.create(message)
                })
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
          
            Remove:function(test){
                test.expect(1)
                
                var message={
                    action:"delete",
                    id:username
                }
                
                handler.actions.delete(message)
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
         
            ChangeEmail:function(test){
                test.expect(1)
                var message={
                    action:"changeEmail",
                    id:username,
                    email:faker.internet.email()
                }
                
                handler.actions.changeEmail(message)
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },

            ChangePassword:function(test){
                test.expect(1)
                var message={
                    action:"changePassword",
                    id:username,
                    salt:crypto.randomBytes(4096).toString('hex'),
                    verifier:crypto.randomBytes(4096).toString('hex')
                }
               
                handler.actions.changePassword(message)
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },

            ResetPassword:function(test){
                test.expect(1)
                var message={
                    action:"resetPassword",
                    id:username
                }
                
                handler.actions.resetPassword(message)
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
            Session:function(test){
                test.expect(1)

                mfa.gen(username)
                .then(function(){
                    return Promise.all([
                            mfa.get(username),
                            verifier_promise
                            ])
                })
                .then(function(results){
                    var token=speakeasy.totp({
                        secret:results[0].secret,
                        encoding:'base32'
                    })

                    var message={
                        action:"session",
                        id:username,
                        B:results[1].A,
                        token:token,
                        hotp:SRPClient.getHotp(username,password,results[1].salt),
                        messageId:"addd"
                    }
                    
                    return handler.actions.session(message)
                })
                .then(function(data){
                    test.ok(validate(data,lambdaOutSchema).valid,"output doesnt match schema")
                })
                .finally(test.done)
            },
            Handler:function(test){
                Promise.all([key_promise,verifier_promise])
                .then(function(results){
                    var keypair=results[0]
                    payload_object={
                                action:"get",
                                id:username,
                                B:crypto.randomBytes(4096).toString('hex'),
                                messageId:"addd",
                                hotp:SRPClient.getHotp(username,password,results[1].salt)
                            }
                    payload=JSON.stringify(payload_object)

                    //generate symetric key
                    var iv=crypto.randomBytes(64).toString('hex')
                    var pass=crypto.randomBytes(20).toString('hex')
                    var algorithm='aes-256-gcm'

                    //encrypt payload with symetric key
                    var cipher = crypto.createCipher(algorithm,pass,iv)
                    var ciphertext = cipher.update(payload,'utf8','hex')
                    ciphertext += cipher.final('hex');

                    //encrypt symetric key with private key
                    var cipherKey=crypto.publicEncrypt(keypair.publicKey,new Buffer(pass)).toString('base64')

                    var body={
                            payload:ciphertext,
                            key:cipherKey,
                            algorithm:algorithm,
                            iv:iv,
                            tag:cipher.getAuthTag().toString('hex')
                        }
                    process.env.RSA_PRIVATE_KEY=keypair.privateKeyEncrypted
                    process.env.RSA_KMS_KEY=config.keyArn
                   
                    test.expect(2);
                    var success=new Promise(function(resolve,reject){
                        var event={
                            body:JSON.stringify(body)
                        }

                        callback=function(err,data){
                            test.ifError(err)
                            resolve()
                        }
                        
                        handler.handler(event,null,callback)
                    })
                    
                    var fail=new Promise(function(resolve,reject){
                        var event={
                            body:crypto.randomBytes(20).toString('hex')
                        }

                        callback=function(err,data){
                            test.ok(err)
                            resolve()
                        }
                        
                        handler.handler(event,null,callback)
                    })

                    Promise.all([success,fail])
                    .finally(test.done)
                }
            )
        }
        }
    }
}




