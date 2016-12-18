module.exports={
    createcognitoidentity:{
        options:{
            package_folder:'lambda/CreateCognitoIdentity/build',
            dist_folder:'tmp'
        }
    },
    createswfactivity:{
        options:{
            package_folder:'lambda/CreateSWFActivity/build',
            dist_folder:'tmp'
        }
    },
    createswfworkflow:{
        options:{
            package_folder:'lambda/CreateSWFWorkFlow/build',
            dist_folder:'tmp'
        }
    },
    createswfdomain:{
        options:{
            package_folder:'lambda/CreateSWFDomain/build',
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

