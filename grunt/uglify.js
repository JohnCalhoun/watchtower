module.exports={
    gremlinproxy:{
        files:{
            "lambda/GremlinProxy/build/handler.js":['lambda/GremlinProxy/handler.js']
        }
    },
    createcognitopool:{
        files:{
            "lambda/CreateCognitoPool/build/handler.js":['lambda/CreateCognitoPool/handler.js'],
            "lambda/CreateCognitoPool/build/process.js":['lambda/CreateCognitoPool/process.js'],
            "lambda/CreateCognitoPool/build/response.js":['lambda/CreateCognitoPool/response.js'],
            "lambda/CreateCognitoPool/build/cognito.js":['lambda/CreateCognitoPool/cognito.js']
        }
    },
    createcognitoidentity:{
        files:{
            "lambda/CreateCognitoIdentity/build/handler.js":['lambda/CreateCognitoIdentity/handler.js'],
            "lambda/CreateCognitoIdentity/build/process.js":['lambda/CreateCognitoIdentity/process.js'],
            "lambda/CreateCognitoIdentity/build/response.js":['lambda/CreateCognitoIdentity/response.js'],
            "lambda/CreateCognitoIdentity/build/cognito.js":['lambda/CreateCognitoIdentity/cognito.js']
        }
    },
    createhealthcheck:{
        files:{
            "lambda/CreateHealthCheck/build/handler.js":['lambda/CreateHealthCheck/handler.js'],
            "lambda/CreateHealthCheck/build/process.js":['lambda/CreateHealthCheck/process.js'],
            "lambda/CreateHealthCheck/build/response.js":['lambda/CreateHealthCheck/response.js']
        }
    },
    sdk:{
        files:{
            "website/js/sdk.js":["tmp/sdk.tmp.js"]
        }
    },    
    dist:{
        files:{
            "website/build/main.js":["tmp/main.js"]
        }
    }
}

