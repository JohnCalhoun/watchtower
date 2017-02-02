var aws=require('aws-sdk')
var ses=new aws.SES({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')
var Promise=require('bluebird')

var EmailTemplate = require('email-templates').EmailTemplate
var path = require('path')

var render=function(type,data){
    return new Promise(function(resolve,reject){
        var templateDir = path.join(__dirname, 'assets',type)
        var template = new EmailTemplate(templateDir)
 
        template.render(data,function(err,result){ 
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}

var send=function(address,body,subject){
    return new Promise(function(resolve,reject){
        var params={
            Destination: { 
                ToAddresses: [address]
            },
            Message: { 
                Body: { 
                    Html: {
                        Data:body,
                    }
                },
                Subject: { 
                    Data:subject
                }
            },
            Source: process.env.EMAIL_SOURCE, 
        }

        ses.sendEmail(params,function(err){
            if(err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
}

exports.send=function(address,data,type){
    var out=render(type,data)
    .then(function(mail){
        return(send(address,mail.html,mail.subject))
    })
    return(out)
}




