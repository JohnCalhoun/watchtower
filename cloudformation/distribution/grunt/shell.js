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
                    "ParameterKey=ApiStackName,ParameterValue=<%= ApiStackName %>",
                    "ParameterKey=WebsiteStackName,ParameterValue=<%= WebsiteStackName %>",
                    "ParameterKey=Cert,ParameterValue=<%= Cert %>",
                    "ParameterKey=DNSZone,ParameterValue=<%= DNSZone %>",
                    "ParameterKey=DNSName,ParameterValue=<%= DNSName %>"
                   ].join(' ')
    },
    updateStack:{
        command:[   
                    "aws cloudformation update-stack",
                    "--template-body file://tmp/CF-<%= StackName %>.json",
                    "--stack-name <%= ProjectName %>-<%= StackName %>",
                    "--capabilities CAPABILITY_IAM",
                    "--parameters",
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










