module.exports={
    uploadServerAssets:{
        command:'aws s3 sync server/ s3://<%= AssetsBucket %>/disclosure/server --exclude "node_modules/*"'
    },
    uploadLambda:{
        command:'aws s3 sync tmp/ s3://<%= AssetsBucket %>/disclosure/lambda --exclude "*" --include "*.zip" '
    },
    moveLambda:{
        command:[
                "mv tmp/createcognitopool*.zip tmp/createcognitopool.zip",
                "mv tmp/createcognitoidentity*.zip tmp/createcognitoidentity.zip",
                "mv tmp/gremlinproxy*.zip tmp/gremlinproxy.zip",
                "mv tmp/createhealthcheck*.zip tmp/createhealthcheck.zip"
                ].join(';')
    },
    createStack:{
        command:"aws cloudformation create-stack --template-body file://tmp/template.json --stack-name <%= stackName %> --capabilities CAPABILITY_IAM"
    },
    updateStack:{
        command:"aws cloudformation update-stack --template-body file://tmp/template.json --stack-name <%= stackName %> --capabilities CAPABILITY_IAM"
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= stackName %>"
    },
    validate:{
        command:"aws cloudformation validate-template --template-body file://tmp/template.json "
    },
    config:{
        command:"cd ./scripts; node ./getConfig.js"
    },
    getSdk:{
        command:[
            "aws apigateway get-sdk --rest-api-id <%= ApiId %> --stage-name production --sdk-type javascript tmp/sdk.zip",
            "unzip  -u tmp/sdk.zip -d tmp"
            ].join(';')
    }
}



