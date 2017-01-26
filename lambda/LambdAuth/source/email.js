var aws=require('aws-sdk')
var ses=new aws.SES({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')

var EmailTemplate = require('email-templates').EmailTemplate
var path = require('path')

exports.send=function(address,data,type){
    var templateDir = path.join(__dirname, 'assets',type)
    var template = new EmailTemplate(templateDir)
       
    return new Promise(function(resolve,reject){
        template.render(data,function(err,result){ 
            if(err){
                reject(err)
                return
            }
            var params={
                Destination: { 
                    ToAddresses: [address]
                },
                Message: { 
                    Body: { 
                        Html: {
                            Data:result.html,
                        }
                    },
                    Subject: { 
                        Data:result.subject
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
    })
}




