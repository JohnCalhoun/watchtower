var decrypt=require('./decrypt.js')
var jsrp=require('jsrp')
var crypto=require('crypto')
var ops=require('./operations.js')
var email=require('./email.js')

exports.handler = function(event, context,callback) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    var Error=function(err){callback(err)}
    
    decrypt(JSON.parse(event.body)).then(
        function(message){
            switch(message.action){
                case "create":
                    var pass=crypto.randomBytes(20).toString('hex')
                    var client=new jsrp.client()  
                    
                    client.init({username:message.id,password:pass},
                    function(){client.createVerifier(function(err,result){
                        ops.create(
                            message.id,
                            message.email,
                            result.salt,
                            result.verifier,
                            message.arn)
                        .then(function(){
                            email.send(message.email,{secret:pass},"invite")
                                .then(function(){
                                    callback(null)
                                },Error)
                        },Error)
                    })})
                    break;

                case "delete":
                    ops.remove(
                        message.id)
                    .then(function(){
                        callback(null) 
                    },Error)
                    break;

                case "changeEmail":
                    ops.update(
                        message.id,
                        {email:message.email})
                    .then(function(){
                        callback(null) 
                    },Error)
                    break;

                case "changePassword":
                    ops.update(
                        message.id,
                        {salt:message.salt,
                        verifier:message.verifier,
                        reset:0})
                    .then(function(){
                        callback(null) 
                    },Error)
                    break;

                case "resetPassword":
                    var pass=crypto.randomBytes(20).toString('hex')
                    var client=new jsrp.client()  
                    
                    client.init({username:message.id,password:pass},
                    function(){client.createVerifier(function(err,result){
                        ops.update(
                            message.id,
                            {salt:result.salt,
                            verifier:result.verifier,
                            reset:1})
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
                    break;

                case "get":
                    ops.get(
                        message.id)
                    .then(function(result){
                        callback(null,result) 
                    },Error)
                    break;

                default:
                    Error("Error: No action given") 
            }
        },Error
    )
}
