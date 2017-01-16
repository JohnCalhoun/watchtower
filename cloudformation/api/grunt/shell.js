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
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %>",
                    "ParameterKey=NetworkStackName,ParameterValue=<%= NetworkStackName %>",
                    "ParameterKey=UserStackName,ParameterValue=<%= UserStackName %>",
                    "ParameterKey=DatabaseStackName,ParameterValue=<%= DatabaseStackName %>" ,
                    "ParameterKey=DBName,ParameterValue=<%= DBName %>" ,
                    "ParameterKey=DBUserWrite,ParameterValue=<%= DBUserWrite %>" ,
                    "ParameterKey=DBPasswordWrite,ParameterValue=<%= DBPasswordWrite %>" ,
                    "ParameterKey=DBUserRead,ParameterValue=<%= DBUserRead %>" ,
                    "ParameterKey=DBPasswordRead,ParameterValue=<%= DBPasswordRead %>" 
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
                    "ParameterKey=ArtifactsBucket,ParameterValue=<%= ArtifactsBucket %>",
                    "ParameterKey=NetworkStackName,ParameterValue=<%= NetworkStackName %>",
                    "ParameterKey=UserStackName,ParameterValue=<%= UserStackName %>",
                    "ParameterKey=DatabaseStackName,ParameterValue=<%= DatabaseStackName %>" ,
                    "ParameterKey=DBName,ParameterValue=<%= DBName %>" ,
                    "ParameterKey=DBUserWrite,ParameterValue=<%= DBUserWrite %>" ,
                    "ParameterKey=DBPasswordWrite,ParameterValue=<%= DBPasswordWrite %>" ,
                    "ParameterKey=DBUserRead,ParameterValue=<%= DBUserRead %>" ,
                    "ParameterKey=DBPasswordRead,ParameterValue=<%= DBPasswordRead %>" 

                ].join(' ')
    },
    deleteStack:{
        command:"aws cloudformation delete-stack --stack-name <%= ProjectName %>-<%= StackName %>"
    },
    validateStack:{
        command:"aws cloudformation validate-template --template-body file://tmp/CF-<%= StackName %>.json"
    }
}










