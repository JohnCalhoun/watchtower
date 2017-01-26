var decrypt=require('./decrypt.js')
var jsrp=require('jsrp')
var crypto=require('crypto')
var ops=require('./operations.js')
var email=require('./email.js')
var mfa=require('./mfa.js')
var session=require('./session.js')
var sign=require('./sign.js')

actions={}

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
            email.send(message.email,{secret:pass,user:message.id},"invite")
                .then(function(){
                    callback(null)
                },Error)
        },Error)
    })})
}

actions.createMFA=function(message,callback){
    mfa.gen(message.id)
    .then(function(){
        mfa.get(message.id)
        .then(function(results){
            sign({
                secret:results.secret,
                qr:results.qr
            },callback,message) 
        },Error)
    },Error)
}

actions.valMFA=function(message,callback){
    mfa.val(message.id,message.token)
    .then(function(){
        callback(null)
    },function(err){callback(err)})
}

actions.delete=function(message,callback){
    ops.remove(
        message.id)
    .then(function(){
        callback(null) 
    },Error)
}

actions.changeEmail=function(message,callback){
    ops.update(
        message.id,
        {email:message.email})
    .then(function(){
        callback(null) 
    },Error)
} 
    

actions.changePassword=function(message,callback){
    ops.update(
        message.id,
        {salt:message.salt,
        verifier:message.verifier,
        reset:0})
    .then(function(){
        callback(null) 
    },Error)
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
            ops.get(message.id)
            .then(function(results){
                email.send(results.email,{secret:pass},"reset")
                    .then(function(){
                        callback(null)
                    },Error)
            },Error)
        },Error)
    })})
} 
    

actions.get=function(message,callback){
    ops.get(
        message.id)
    .then(function(result){
        sign({
            id:result.id,
            email:result.email
        },callback,message) 
    },Error)
} 

actions.session=function(message,callback){
    session(message.id,message.B,message.token).then(
        function(results){  
            sign(results,callback,message)
        },Error)
} 

exports.handler = function(event, context,callback) {
    var Error=function(err){callback(err)}
    
    decrypt(JSON.parse(event.body)).then(
        function(message){
            try{
                actions[message.action](message,callback) 
            }catch(err){
                callback(err)
            }
        },Error)
}






