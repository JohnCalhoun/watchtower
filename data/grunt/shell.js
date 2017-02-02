module.exports={
    validate:{
        command:"aws cloudformation validate-template --template-body file://template.json "
    },
    snapshot:{
        command:[
            "ID=$(aws cloudformation describe-stacks --stack-name <%= stackname %> | jq '.Stacks[0].Outputs[0].OutputValue' | sed -e's/\"//g' )",
            "aws rds delete-db-snapshot --db-snapshot-identifier <%= snapshotID %>",
            "aws rds create-db-snapshot --db-snapshot-identifier <%= snapshotID %> --db-instance-identifier $ID"
        ].join(';')
    }

}










