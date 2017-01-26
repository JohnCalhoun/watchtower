var aws=require('aws-sdk')
var ses=new aws.SES({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')

exports.send=function(address,data,temp,subject){
    var template=hb
            .compile(fs.readFileSync(__dirname+"/assets/"+temp+".hb").toString('ascii'))
    var params={
        Destination: { 
            ToAddresses: [address]
        },
        Message: { 
            Body: { 
                Html: {
                    Data:template(data),
                    Charset:"UTF-8"
                }
            },
            Subject: { 
                Data: subject
            }
        },
        Source: process.env.EMAIL_SOURCE, 
    }

    return new Promise(function(resolve,reject){
        ses.sendEmail(params,function(err){
            if(err){
                reject(err)
            }else{
                resolve()
            }
        })
    })
}




