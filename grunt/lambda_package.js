module.exports={
    gremlinproxy:{
        options:{
            package_folder:'lambda/GremlinProxy/build',
            dist_folder:'tmp'
        }
    },
    createcognitoidentity:{
        options:{
            package_folder:'lambda/CreateCognitoIdentity/build',
            dist_folder:'tmp'
        }
    },
    createcognitopool:{
        options:{
            package_folder:'lambda/CreateCognitoPool/build',
            dist_folder:'tmp'
        }
    },
    createhealthcheck:{
        options:{
            package_folder:'lambda/CreateHealthCheck/build',
            dist_folder:'tmp'
        }
    }
}

