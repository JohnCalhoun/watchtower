module.exports={
    uploadLambda:{
        command:'aws s3 sync tmp/ s3://<%= AssetsBucket %>/disclosure/lambda --exclude "*" --include "l*.zip" '
    },
    moveLambda:{
        command:[
                "mv tmp/lambda-createcognitopool*.zip tmp/lambda-createcognitopool.zip",
                "mv tmp/lambda-createcognitoidentity*.zip tmp/lambda-createcognitoidentity.zip",
                "mv tmp/lambda-rdsproxy*.zip tmp/lambda-rdsproxy.zip",
                "mv tmp/lambda-createhealthcheck*.zip tmp/lambda-createhealthcheck.zip",
                "mv tmp/lambda-initdatabase*.zip tmp/lambda-initdatabase.zip"
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
    },
    metalsmith:{
        command:"node website/html/metalsmith.js"
    },
    favicon:{
        command:'convert -size 16x16 xc:#418b7e website/build/favicon.gif'
    },
    getCognitoSdk:{
        command:[
                    "wget https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js -O tmp/cognito-ID-sdk.js",
                    "wget https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/aws-cognito-sdk.min.js -O tmp/cognito-sdk.js",
                    "wget http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn.js -O tmp/jsbn.js",
                    "wget http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn2.js -O tmp/jsbn2.js",
                    "wget https://github.com/bitwiseshiftleft/sjcl/archive/master.zip -O tmp/sjcl.zip",
                        "cd tmp",
                        "unzip -o sjcl.zip",
                        "cd sjcl-master",
                        "./configure --with-codecBytes",
                        "make",
                        "cp sjcl.js ..",
                        "cd ../..",
                    "wget http://momentjs.com/downloads/moment.min.js -O tmp/moment.js"
                ].join(';')
    },
    cleanAMI:{
        command:'cd ./server; ./clean-images.sh'
    },
    bakeAMI:{
        command:'cd ./server; ./packer build ./config.json | tee ./build.log'
    },
    updateAMI:{
        command:'cd ./server; ./update-mappings.sh'
    }
}
