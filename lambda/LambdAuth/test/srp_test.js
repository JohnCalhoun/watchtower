var require_helper=require('./require_helper.js')
var BigInteger = require('jsbn').BigInteger;
var crypto=require('crypto')
var bitlength=32
var Promise=require('bluebird')
var SRP=require_helper('SRP/srp.js')('modp18',bitlength)
var SRPClient = require_helper('SRP/client.js')('modp18',bitlength);
var SRPServer = require_helper('SRP/server.js')('modp18',bitlength);
var faker=require('faker')

var util=require_helper('SRP/util.js')

module.exports={
    util:{
        toN:function(test){
            var length=100 
             
            var bi=new BigInteger('100')
            var result=util.toN(bi,length)
            
            test.done()
        },
        hash:function(test){
            test.expect(1)
            
            var text=faker.lorem.words()
            var result=util.hash('sha256')(text)
            
            test.notEqual(text,result)
            test.done()
        },
        toBigInt:function(test){
            test.expect(1)

            var value=123478 
            var num=Buffer.from(value.toString(),'hex')
            var integer= util.toBigInteger(num)
            test.ok(integer)
            test.done()
        },
        undo:function(test){
            var length=100 
            var num=100
            
            var bi=new BigInteger(num.toString())
            var buffer=util.toN(bi,length*8)
            var integer= util.toBigInteger(buffer)
            
            test.equal(num.toString(),integer.toString())
            test.done()
        },
        isZero:function(test){
            test.ok(util.isZero(new BigInteger('0')))
            test.ok(!util.isZero(new BigInteger('1')))
            test.done()
        },
        wraps:function(test){
            var g=new BigInteger("2")
            var a=new BigInteger("2")
            var n1=new BigInteger("2")
            var n2=new BigInteger("10")

            test.ok(util.wraps(g,a,n1))
            test.ok(!util.wraps(g,a,n2))
            test.done()
        }
    },
    SRP:{
        constants:function(test){
            test.expect(1)
            var value=SRP.constants()
            test.ok(value)
            test.done()
        },
        randomInt:function(test){
            test.expect(1)
            var value=SRP.randomInt(64)
            test.ok(value)
            test.done()
        },
        x:function(test){
            var I = new Buffer("alice");
            var P = new Buffer("password123");
            var s = new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex');

            test.expect(1)
            var value=SRP.x(I,P,s)
            test.ok(value)
            test.done()
        },
        hotp:function(test){
            var I = new Buffer("alice");
            var P = new Buffer("password123");
            var s = new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex');

            var ver=SRP.v(SRP.x(I,P,s))
            var value=SRP.clientHotp(I,P,s)
            
            var check=SRP.check(ver,value)
            
            test.done()
        },
        v:function(test){
            test.expect(1)
            var x =util.toBigInteger(new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex'))
            
            var value=SRP.v(x)
            test.ok(value)
            test.done()
        },
        A:function(test){
            test.expect(1)
            
            var value=SRP.A(32)
            test.ok(value)
            test.done()
        },
        B:function(test){
            test.expect(1)
            
            var v =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            
            var value=SRP.B(v,32)
            test.ok(value)
            test.done()
        },
        u:function(test){
            test.expect(1)
            
            var value=SRP.u("a","b")
            test.ok(value)
            test.done()

        },
        K:function(test){
            test.expect(1)

            SRP.K(new Buffer('asdfasdfasdf'),'111111111111111')
            .then(function(value){
                test.ok(value.length=64)
                test.done()
            })//.finally(test.done)
        },
        clientS:function(test){
            test.expect(1)
            var B =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            var A =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            var a =util.toBigInteger(new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex'))
            var s = new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex');
 
            var username=faker.internet.userName()
            var password=faker.internet.password()

            var value=SRP.clientS(A,B,a,username,password,s).key
            test.ok(value)
            test.done()
        },
        serverS:function(test){
            test.expect(1)
            
            var A =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            var B =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            var b =util.toBigInteger(new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex'))
            var v =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            
            var value=SRP.serverS(A,B,b,v).key
            test.ok(value)
            test.done()
        },
        serverSReject:function(test){
            test.expect(1)
            
            var A =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            
            var B =util.toN(new BigInteger('0000'),bitlength)
            var b =util.toBigInteger(new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex'))
            var v =new Buffer('beb25379d1a8581eb5a727673a2441ee', 'hex')
            try{ 
                var value=SRP.serverS(A,B,b,v).key
            }catch(e){
                test.ok(e)
                test.done()
            }
        }
    },
    register:function(test){
        var username=faker.internet.userName()
        var password=faker.internet.password()


        var verifier=SRPClient.getSaltVerifier(username,password)
       
        test.expect(2)
        test.ok(verifier.salt)
        test.ok(verifier.v)
        test.done()
    },
    exchange:function(test){
        var username=faker.internet.userName()
        var password=faker.internet.password()

        var verifier=SRPClient.getSaltVerifier(username,password)

        test.ok(verifier.v)
        test.ok(verifier.salt)

        var hotp=SRPClient.getHotp(username,password,verifier.salt)
        test.ok(hotp)

        var clientMaterial=SRPClient.genA()  
        test.ok(clientMaterial.A)
        test.ok(clientMaterial.a)

        var check=SRPServer.checkHotp(verifier.v,hotp) 
        test.ok(check)
        
        var serverPromise=SRPServer.genBandShared(
            clientMaterial.A,
            verifier.salt,
            verifier.v
        )


        var clientPromise=serverPromise
        .then(function(serverMaterial){

            test.ok(serverMaterial.key)
            test.ok(serverMaterial.B)
            
            return SRPClient.getShared(
                clientMaterial.A,
                serverMaterial.B,
                clientMaterial.a,
                username,
                password,
                verifier.salt)
        })
    
        var debugPromise=Promise.join(
            clientPromise,
            serverPromise,
            function(clientKey,serverMaterial){

                test.ok(clientKey.key) 
                return SRP.debug(
                    clientMaterial.A,
                    serverMaterial.B,
                    clientMaterial.a,
                    serverMaterial.b,
                    username,
                    password,
                    verifier.salt
                )
            }
        )

        Promise.join(
            clientPromise,
            serverPromise,
            debugPromise,
            function(clientKey,serverMaterial,common){
                test.equal(
                    clientKey.key,
                    common
                )
                test.equal(
                    serverMaterial.key,
                    common
                )
                test.equal(
                    serverMaterial.key,
                    clientKey.key
                )
            }
        ).finally(test.done)
    }
}
     







