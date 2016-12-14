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
        src:['cloudformation/resources/R_*.json'],
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
    }
}
