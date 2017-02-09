process.env.REGION='us-east-1'

var create=require('./create.js')
var update=require('./update.js')
var del=require('./delete.js')

var crypto=require('crypto')
var config=require('../config.json')
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
            bitLength:256
        }
        test.expect(3);
        create(params,
            function(err,id,data){
                test.ifError(err) 
                test.ok(data.privateKey)
                test.ok(data.publicKey)
                test.done()
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
        test.expect(3); 
        update("tmp",params,{},
             function(err,id,data){
                test.ifError(err,"should be no error") 
                test.ok(data.privateKey)
                test.ok(data.publicKey)
                test.done()
            }
        );
    }
}

