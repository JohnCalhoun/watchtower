var decrypt=require('./decrypt.js')
var jsrp=require('jsrp')
var crypto=require('crypto')
var ops=require('./operations.js')
var email=require('./email.js')
var mfa=require('./mfa.js')
var session=require('./session.js')
var sign=require('./sign.js')
var log=require('./log.js')
actions={}

var Error=function(callback){
    return function(err){
        log.log(err,log.levels.error)
        callback(true)
    }
}
exports.Error=Error

var Success=function(callback){
    return function(){
        callback(null)
    }
}
exports.Success=Success

actions.create=function(message,callback){
    var pass=crypto.randomBytes(20).toString('hex')
    var client=new jsrp.client()  
    
    client.init({username:message.id,password:pass},
    function(){client.createVerifier(function(err,result){
        ops.create(
            message.id,
            message.email,
            result.salt,
            result.verifier,
            message.group
        )
        .then(function(){
            return email.send(message.email,{secret:pass,user:message.id},"invite")
        })
        .then(function(){
            sign({password:pass},
                callback,
                message)
        })
        .then(null,Error(callback))
    
    })})
}

actions.createMFA=function(message,callback){
    mfa.gen(message.id)
    .then(function(){
        return mfa.get(message.id)
    })
    .then(function(results){
        sign({
            secret:results.secret,
            qr:results.qr
        },callback,message) 
    })
    .then(null,Error(callback))
}

actions.valMFA=function(message,callback){
    mfa.val(message.id,message.token)
    .then(Success(callback))
    .then(null,Error(callback))
}

actions.delete=function(message,callback){
    ops.remove(message.id)
    .then(Success(callback))
    .then(null,Error(callback))
}

actions.changeEmail=function(message,callback){
    ops.update(
        message.id,
        {email:message.email})
    .then(Success(callback))
    .then(null,Error(callback))
} 
    

actions.changePassword=function(message,callback){
    ops.update(
        message.id,
        {salt:message.salt,
        verifier:message.verifier,
        reset:0})
    .then(Success(callback))
    .then(null,Error(callback))
} 
    

actions.resetPassword=function(message,callback){
    var pass=crypto.randomBytes(20).toString('hex')
    var client=new jsrp.client()  
    
    client.init({username:message.id,password:pass},
    function(){client.createVerifier(function(err,result){
        ops.update(
            message.id,
            {salt:result.salt,
            verifier:result.verifier,
            reset:1,
            mfaEnabled:false})
        .then(function(){
            return ops.get(message.id)
        })
        .then(function(results){
            return email.send(results.email,{secret:pass},"reset")
        })
        .then(Success(callback))
        .then(null,Error(callback))
    })})
} 
    

actions.get=function(message,callback){
    ops.get(message.id)
    .then(function(result){
        sign({
            id:result.id,
            email:result.email
        },callback,message) 
    })
    .then(null,Error(callback))
} 

actions.session=function(message,callback){
    session(message.id,message.B,message.token)
    .then(function(results){  
        sign(results,callback,message)
    })
    .then(null,Error(callback))
} 

exports.actions=actions

exports.handler = function(event, context,callback) {
    decrypt(JSON.parse(event.body))
    .then(function(message){
        actions[message.action](message,callback) 
    })
    .then(null,Error(callback))
}






