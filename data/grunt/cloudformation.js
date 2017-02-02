module.exports={
    options:{
        region:'us-east-1'
    },
    create:{
        action:"create-stack",
        stackName:"<%= stackname %>",
        src:['template.json'],
        params:{
            DBUser:'root',
            DBPassword:'<%= DBPassword %>',
            EndPointURL:'<%= DBendpoint %>',
            HostedZone:'<%= HostedZone %>'
        },
        trackStatus:true
    },
    update:{
        stackName:"<%= stackname %>",
        src:['template.json'],
        params:{
            DBUser:'root',
            DBPassword:'<%= DBPassword %>',
            EndPointURL:'<%= DBendpoint %>',
            HostedZone:'<%= HostedZone %>'
        },
        action:"update-stack"
    },
    remove:{
        action:"delete-stack",
        stackName:"<%= stackname %>"
    }
}
