module.exports={
    createcognitoidentity:{
        options:{
            handler:'handler',
            file_name:'lambda/CreateCognitoIdentity/build/handler.js',
            event:'lambda/CreateCognitoIdentity/event.json'
        }
    },
    createcognitopool:{
        options:{
            handler:'handler',
            file_name:'lambda/CreateCognitoPool/build/handler.js',
            event:'lambda/CreateCognitoPool/event.json'
        }
    }
}

