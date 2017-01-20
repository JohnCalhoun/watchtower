process.env.REGION='us-east-1'

var create=require('./create.js')
var update=require('./update.js')
var del=require('./delete.js')

var crypto=require('crypto')
var config=require('../config.json')
var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})
process.env.KMS_KEY=config.keyArn

module.exports={
    setUp:function(callback){
        callback()
    },
    tearDown:function(callback){
        callback() 
    },
    testCreate:function(test) {
        params={
            keyArn:config.keyArn,
            bitLength:256
        }
        test.expect(5);
        create(params,
            function(err,id,data){
                test.ifError(err) 
                test.ok(data.privateKey)
                test.ok(data.publicKey)
                kms.decrypt(
                    {
                        CiphertextBlob:data.privateKey
                    },
                    function(err,DecryptedData){
                        test.ifError(err,"Should be able to decrypt privateKey")
                        var privateKey=DecryptedData.Plaintext
                        var text='test'
                        
                        var ciphertext=crypto.publicEncrypt(data.publicKey,new Buffer(text))
                        var plaintext=crypto.privateDecrypt(privateKey,ciphertext)
                        
                        test.equal(text,plaintext)
                        test.done();
                    }
                )
            })
    },

    testDelete:function(test) {
        params={}
        test.expect(1);
        id=""
        del(id,params,
            function(err,id,data){
                test.ifError(err,"should be no error") 
                test.done() 
            });

    },

    testUpdate:function(test) {
        params={
            keyArn:config.keyArn,
            bitLength:256
        }
        test.expect(5); 
        update("tmp",params,{},
             function(err,id,data){
                test.ifError(err,"should be no error") 
                test.ok(data.privateKey)
                test.ok(data.publicKey)
                kms.decrypt(
                    {
                        CiphertextBlob:data.privateKey
                    },
                    function(err,DecryptedData){
                        test.ifError(err,"Should be able to decrypt privateKey")
                        var privateKey=DecryptedData.Plaintext
                        var text='test'
                        
                        var ciphertext=crypto.publicEncrypt(data.publicKey,new Buffer(text))
                        var plaintext=crypto.privateDecrypt(privateKey,ciphertext)
                        
                        test.equal(text,plaintext)
                        test.done();
                    }
                )
            }
        );
    }
}

