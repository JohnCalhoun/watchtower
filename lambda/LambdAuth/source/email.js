var aws=require('aws-sdk')
var ses=new aws.SES({region:process.env.REGION})
var hb=require('handlebars')
var fs=require('fs')

exports.send=function(address,data,temp){
    var template=hb
            .compile(fs.readFileSync(__dirname+"/assets/"+temp+".hb").toString())
    
    var params={
        Destination: { 
            ToAddresses: [address]
        },
        Message: { 
            Body: { 
                Html: {
                    Data:template(data)
                }
            },
            Subject: { 
                Data: 'Password Reset' 
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




