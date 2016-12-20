module.exports={
    resources:{
        options:{
            separator:',\n',
            banner:'"Resources":{ \n',
            footer:'}',
            stripBanners:{
                block:true,
                line:true
            }
        },
        src:['cloudformation/resources/*.json'],
        dest:'tmp/resources.json'
    },
    cloudformation:{
        options:{
            separator:',\n',
            banner:'{ \n"AWSTemplateFormatVersion":"2010-09-09",\n"Description":"",\n',
            footer:'}',
            stripBanners:{
                block:true,
                line:true
            }
        },
        src:['cloudformation/*.json','tmp/resources.json'],
        dest:'tmp/template.json'
    },
    sdk:{
        options:{},
        src:[   'tmp/apiGateway-js-sdk/lib/apiGatewayCore/*.js',
                'tmp/apiGateway-js-sdk/lib/axios/dist/*.js',
                'tmp/apiGateway-js-sdk/lib/CryptoJS/*/*.js',
                'tmp/apiGateway-js-sdk/lib/url-template/*.js',
                'tmp/apiGateway-js-sdk/*.js'
                ],
        dest:'tmp/sdk.tmp.js'
    }
}
