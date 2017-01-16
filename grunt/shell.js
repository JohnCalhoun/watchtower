module.exports={
    uploadLambda:{
        command:'aws s3 sync tmp/ s3://<%= ArtifactsBucket %>/disclosure/lambda --exclude "*" --include "l*.zip" '
    },
    moveSqlScripts:{
        command:"cp lambda/InitDataBase/scripts/*.sql lambda/InitDataBase/build"
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
        command:[
                    "aws cloudformation create-stack",
                    "--template-body file://tmp/template.json",
                    "--stack-name <%= stackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--disable-rollback",
                    "--parameters",
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %> ",
                    "ParameterKey=DBName,ParameterValue=<%=  DBName%> ",
                    "ParameterKey=DBUserWrite,ParameterValue=<%=  DBUserWrite%> ",
                    "ParameterKey=DBUserRead,ParameterValue=<%=  DBUserRead%> ",
                    "ParameterKey=DBUser,ParameterValue=<%=  DBUser%> ",
                    "ParameterKey=DBPassword,ParameterValue=<%=  DBPassword%> ",
                    "ParameterKey=DBPasswordWrite,ParameterValue=<%=  DBPasswordWrite%> ",
                    "ParameterKey=DBPasswordRead,ParameterValue=<%= DBPasswordRead %> ",
                    "ParameterKey=LogBucket,ParameterValue=<%= LogBucket %> ",
                    "ParameterKey=Cert,ParameterValue=<%= Cert %> ",
                    "ParameterKey=DNSZone,ParameterValue=<%= DNSZone %> ",
                    "ParameterKey=DNSName,ParameterValue=<%= DNSName %> ",
                    "ParameterKey=GitCloneUrl,ParameterValue=<%= GitCloneUrl %> "
                ].join(' ')
    },
    updateStack:{
         command:[
                    "aws cloudformation update-stack",
                    "--template-body file://tmp/template.json",
                    "--stack-name <%= stackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--disable-rollback",
                    "--parameters",
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %> ",
                    "ParameterKey=DBName,ParameterValue=<%=  DBName%> ",
                    "ParameterKey=DBUserWrite,ParameterValue=<%=  DBUserWrite%> ",
                    "ParameterKey=DBUserRead,ParameterValue=<%=  DBUserRead%> ",
                    "ParameterKey=DBUser,ParameterValue=<%=  DBUser%> ",
                    "ParameterKey=DBPassword,ParameterValue=<%=  DBPassword%> ",
                    "ParameterKey=DBPasswordWrite,ParameterValue=<%=  DBPasswordWrite%> ",
                    "ParameterKey=DBPasswordRead,ParameterValue=<%= DBPasswordRead %> ",
                    "--capabilities CAPABILITY_IAM"
                ].join(' ')
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= stackName %>"
    },
    validate:{
        command:"aws cloudformation validate-template --template-body file://tmp/template.json "
    },
    uploadWebsite:{
        command:"aws s3 sync ./website/build <%= WebsiteBucket %>"
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
    copyInitSql:{
        command:[
            'cp sql/init-*.sql lambda/InitDataBase/build',
            'cp sql/read-*.sql lambda/RDSProxy/build',
            'cp sql/write-*.sql lambda/RDSProxy/build'
        ].join(';')
    },
    startMySQL:{
        command:[
                "$(docker ps | grep MYSQLTEST >/dev/null)",
                "||",
                'echo "$(docker run --name MYSQLTEST -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:8.0;sleep 20;)"'
                ].join(' ')
    },
    stopMySQL:{
        command:"docker kill MYSQLTEST;docker rm MYSQLTEST"
    },
    testSQL:{
        command:"export MYSQL_PORT=3306;export MYSQL_PASSWORD=password;cd sql; ./test.py"
    }
}


