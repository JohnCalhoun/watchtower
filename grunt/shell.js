module.exports={
    moveLambda:{
        command:"mv tmp/createcognitopool*.zip tmp/createcognitopool.zip;\
                 mv tmp/createcognitoidentity*.zip tmp/createcognitoidentity.zip;"
    },
    updateStack:{
        command:"aws cloudformation update-stack --template-body file://tmp/template.json --stack-name <%= stackName %> --capabilities CAPABILITY_IAM"
    },
    createStack:{
        command:"aws cloudformation create-stack --template-body file://tmp/template.json --stack-name <%= stackName %> --capabilities CAPABILITY_IAM"
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= stackName %>"
    },
    validate:{
        command:"aws cloudformation validate-template --template-body file://tmp/template.json "
    }
}

