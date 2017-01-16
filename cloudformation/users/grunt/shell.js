module.exports={
    createStack:{
        command:[
                    "aws cloudformation create-stack",
                    "--template-body file://tmp/CF-<%= StackName %>.json",
                    "--stack-name <%= ProjectName %>-<%= StackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--disable-rollback",
                    "--parameters",
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %> ",
                    "ParameterKey=EnvType,ParameterValue=<%= EnvType %>"
                ].join(' ')
    },
    updateStack:{
        command:[   
                    "aws cloudformation update-stack",
                    "--template-body file://tmp/CF-<%= StackName %>.json",
                    "--stack-name <%= ProjectName %>-<%= StackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--parameters",
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %> ",
                    "ParameterKey=EnvType,ParameterValue=<%= EnvType %>"
                ].join(' ')
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= ProjectName %>-<%= StackName %>"
    },
    validateStack:{
        command:"aws cloudformation validate-template --template-body file://tmp/CF-<%= StackName %>.json"
    }
}










