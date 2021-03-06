var crypto=require('crypto')
var algorithm='aes-256-ctr'
var validate=require('jsonschema').validate
var schema=require(__dirname+'/assets/returnschema.json')
var srp=require('./srp.js')
var log=require('./log.js')

var Promise=require('bluebird')
var algorithm="aes-256-gcm"

var encapsulate=function(payload,key,aad,B){
    var iv=crypto.randomBytes(64).toString('hex')
    
    var cipher = crypto.createCipher(algorithm,key,iv);
    cipher.setAAD(Buffer.from(aad))
    var text=cipher.update(JSON.stringify(payload), 'utf8', 'hex');
    text+=cipher.final('hex')
    return {
        result:text,
        tag:cipher.getAuthTag().toString('hex'),
        iv:iv,
        algorithm:algorithm,
        B:B.toString('hex')
    }
}

module.exports=function(output,message){
    return function(){
        return message ? Promise.resolve() : Promise.reject()
    }()
    .then(function(){
        return srp.getSharedKey(message.B,message.id,message.hotp)
    })
    .then(function(key){
        return encapsulate(output,Buffer.from(key.key,'hex'),message.messageId,key.B)
    },
        function(){
        var size=Math.floor(Math.random()*(100-20)+20)

        var data=crypto.randomBytes(size).toString('hex')
        var key=crypto.randomBytes(size).toString('hex')
        var B=crypto.randomBytes(size).toString('hex')
        var aad=Math.floor(Math.random()*1000)
        return encapsulate(data,key,aad.toString(),B)
    })
}

