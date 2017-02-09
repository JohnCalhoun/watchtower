var decrypt=require('./decrypt.js')
var crypto=require('crypto')
var ops=require('./operations.js')
var email=require('./email.js')
var mfa=require('./mfa.js')
var session=require('./session.js')
var sign=require('./sign.js')
var log=require('./log.js')
var Promise=require('bluebird')
var srp = require('./srp.js')('modp18');
var config=require('./config.js')

var validate=require('jsonschema').validate
var messageschema=require(__dirname+'/assets/messageschema.json')
var bodyschema=require(__dirname+'/assets/bodyschema.json')

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
        var output=result || {salt:crypto.createHash('sha512').update(message.id).digest('hex')} 
        return {
            salt:output.salt,
            publicKey:process.env.RSA_PUBLIC_KEY,
            group:'modp18'
        }
    })
} 

actions.session=function(message){
    
    return session(message.id,message.B,message.token)
    .then(function(results){  
        return sign({
            credentials:results,
            publicKey:process.env.RSA_PUBLIC_KEY
            },message)
    })
} 

exports.actions=actions

var val=function(doc,schema,id){
    return validate(doc,schema).valid ? Promise.resolve(doc) : Promise.reject("ValidationFailed:"+id)
}

exports.handler = function(event, context,callback) {
    var timers={}
    var times=[]

    var work=Promise.try(function(){
        return config.get(process.env.CONFIG_BUCKET,process.env.CONFIG_FILE)         
    })
    .then(function(data){
        config.merge(data,process.env)
    })
    .then(function(){
        return JSON.parse(event.body)
    })
    .then(function(body){
        return val(body,bodyschema,"Body")
    })
    .then(function(message){ 
        timers.decrypt=process.hrtime()
        return decrypt(message)
    })
    .tap(function(){
        times.push({name:'decrypt',time:process.hrtime(timers.decrypt)})
    })
    .then(function(message){
        return val(message,messageschema,"message")
    })
    .then(function(message){
        return message.action!=='create' ? ops.check(message) : message
    })
    .then(function(message){
        return log.action(message.action)
        .then(function(){ 
            return actions[message.action](message) 
        })
    })
    .tap(function(){
        times.push({name:'action',time:process.hrtime(timers.action)})
        return log.times(times)
    })
    .then(
        function(material){
            return {err:null,data:material}
        },
        function(err){
            log.log(err,"Error")
            return {err:true,data:null}
        }
    )
    .finally(function(){
    })

    Promise.join(
        work,
        Promise.delay(process.env.LAMBDA_WAIT_TIME*1000),
        function(result){
            callback(result.err,result.data) 
        })
}






