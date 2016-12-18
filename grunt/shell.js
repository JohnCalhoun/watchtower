module.exports={
    uploadServerAssets:{
        command:'aws s3 sync server/ s3://<%= AssetsBucket %>/disclosure/server --exclude "node_modules/*"'
    },
    moveLambda:{
        command:[
                "mv tmp/createcognitopool*.zip tmp/createcognitopool.zip",
                "mv tmp/createcognitoidentity*.zip tmp/createcognitoidentity.zip",
                "mv tmp/createhealthcheck*.zip tmp/createhealthcheck.zip",
                "mv tmp/createswfdomain*.zip tmp/createswfdomain.zip",
                "mv tmp/createswfactivity*.zip tmp/createswfactivity.zip",
                "mv tmp/createswfworkflow*.zip tmp/createswfworkflow.zip"
                ].join(';')
    },
    createStack:{
        command:"aws cloudformation deploy --template-file tmp/template.yaml --stack-name <%= stackName %> --capabilities CAPABILITY_IAM"
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= stackName %>"
    },
    validate:{
        command:"aws cloudformation validate-template --template-body file://tmp/template.yaml "
    },
    packageStack:{
        command:"aws cloudformation package --template-file tmp/template.tmp.json --s3-bucket <%= AssetsBucket %> --s3-prefix <%= stackName %> --output-template-file tmp/template.yaml"
    }
}

