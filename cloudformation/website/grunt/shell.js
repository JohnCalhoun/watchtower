module.exports={
    createStack:{
        command:[
                    "aws cloudformation create-stack",
                    "--template-body file://tmp/CF-<%= StackName %>.json",
                    "--stack-name <%= ProjectName %>-<%= StackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--disable-rollback",
                    "--parameters",
                    "ParameterKey=EnvType,ParameterValue=<%= EnvType %>",
                    "ParameterKey=GitCloneUrl,ParameterValue=<%= GitCloneUrl %>",
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %>"
                ].join(' ')
    },
    updateStack:{
        command:[   
                    "aws cloudformation update-stack",
                    "--template-body file://tmp/CF-<%= StackName %>.json",
                    "--stack-name <%= ProjectName %>-<%= StackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--parameters",
                    "ParameterKey=EnvType,ParameterValue=<%= EnvType %>",
                    "ParameterKey=GitCloneUrl,ParameterValue=<%= GitCloneUrl %>",
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %>"
                ].join(' ')
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= ProjectName %>-<%= StackName %>"
    },
    validateStack:{
        command:"aws cloudformation validate-template --template-body file://tmp/CF-<%= StackName %>.json"
    },
    Status:{
        command:'aws cloudformation describe-stacks --stack-name <%= ProjectName %>-<%= StackName %> | jq ".Stacks[0].StackStatus"'
    }

}










