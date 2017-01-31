var decrypt=require('./decrypt.js')
var crypto=require('crypto')
var ops=require('./operations.js')
var email=require('./email.js')
var mfa=require('./mfa.js')
var session=require('./session.js')
var sign=require('./sign.js')
var log=require('./log.js')
var srp = require('./srp.js');

actions={}
actions.create=function(message){
    var pass=crypto.randomBytes(20).toString('hex')
    
    var material=srp.genVerifier(message.newId,pass) 

    return ops.create(
        message.newId,
        message.email,
        material.salt,
        material.v,
        message.group
    )
    .then(function(){
        return email.send(message.email,{user:message.id},"invite")
    })
    .then(function(){
        return sign({password:pass},message)
    })
}

actions.createMFA=function(message){

    return mfa.gen(message.id)
    .then(function(){
        return mfa.get(message.id)
    })
    .then(function(results){
        return sign({
            secret:results.secret,
            qr:results.qr
        },message) 
    })
}

actions.valMFA=function(message){
    
    return mfa.val(message.id,message.token)
    .then(function(){
        return true
    })
}

actions.delete=function(message){

    return ops.remove(message.id)
    .then(function(){
        return true
    })
}

actions.changeEmail=function(message){
    return ops.update(
        message.id,
        {email:message.email})
    .then(function(){
        return true
    })
} 

actions.changePassword=function(message){
    return ops.update(
        message.id,
        {salt:message.salt,
        verifier:message.verifier,
        reset:0})
    .then(function(){
        return true
    })
} 
    

actions.resetPassword=function(message){
    var pass=crypto.randomBytes(20).toString('hex')

    var material=srp.genVerifier(message.id,pass) 
    
    return ops.update(
        message.id,
        {salt:material.salt,
        verifier:material.v,
        reset:1,
        mfaEnabled:false})
    .then(function(){
        return ops.get(message.id)
    })
    .then(function(results){
        return email.send(results.email,{secret:pass},"reset")
    })
    .then(function(){
        return true
    })
} 

actions.get=function(message){
    
    return ops.get(message.id)
    .then(function(result){
        return sign({
            id:result.id,
            email:result.email,
            salt:result.salt
        },message) 
    })
} 

actions.salt=function(message){
    
    return ops.get(message.id)
    .then(function(result){
        var output=result || {salt:crypto.randomBytes(64).toString('hex')} 
        return {
            salt:output.salt
        }
    })
} 

actions.session=function(message){
    
    return session(message.id,message.B,message.token)
    .then(function(results){  
        return sign(results,message)
    })
} 

exports.actions=actions

exports.handler = function(event, context,callback) {
    decrypt(JSON.parse(event.body))
    .then(function(message){
        if(message.action!=='create'){
            return ops.check(message)
        }else{
            return message
        }
    })
    .then(function(message){
        actions[message.action](message) 
    })
    .then(
        function(material){
            callback(null,material)
        },
        function(err){
            log.log(err,log.levels.error)
            callback(true)
        }
    )
}






