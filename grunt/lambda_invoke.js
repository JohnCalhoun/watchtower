module.exports={
    createswfactivity:{
        options:{
            handler:'handler',
            file_name:'lambda/CreateSWFActivity/build/handler.js',
            event:'lambda/CreateSWFActivity/event.json'
        }
    },
    createswfworkflow:{
        options:{
            handler:'handler',
            file_name:'lambda/CreateSWFWorkFlow/build/handler.js',
            event:'lambda/CreateSWFWorkFlow/event.json'
        }
    },
    createswfdomain:{
        options:{
            handler:'handler',
            file_name:'lambda/CreateSWFDomain/build/handler.js',
            event:'lambda/CreateSWFDomain/event.json'
        }
    },
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

