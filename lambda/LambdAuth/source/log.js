var aws=require('aws-sdk')
var Promise=require('bluebird')
var cloudwatch=new aws.CloudWatch({region:process.env.REGION})

levels={
    "Info":0,
    "Warn":100,
    "Error":200,
    "Fatal":300
}

exports.log=function(message,severity){
    if(levels[process.env.LOG_LEVEL]<=levels[severity]){
        console.log(severity+": "+message)
    }
}

exports.action=function(action){
    return new Promise(function(resolve,reject){
        var params={
            MetricData: [ 
                {
                    MetricName: action, 
                    Unit: 'Count',
                    Value: 1,
                    Dimensions:[
                        {
                            Name:"lambdaName",
                            Value:process.env.AWS_LAMBDA_FUNCTION_NAME
                        }
                    ]
                }
            ],
            Namespace: 'WatchTower-LambdAuth'
        }

        cloudwatch.putMetricData(params,
        function(err,data){
            err ? reject(err) : resolve()
        })
    })
}

exports.times=function(times){
    return new Promise(function(resolve,reject){
        var params={
            MetricData: [],
            Namespace: 'WatchTower-LambdAuth'
        }
        
        times.forEach(function(info){
            params.MetricData.push({
                MetricName:"timing",
                Unit:'Milliseconds',
                Dimensions:[
                    {   
                        Name:"section",
                        Value:info.name    
                    },
                    {
                        Name:"lambdaName",
                        Value:process.env.AWS_LAMBDA_FUNCTION_NAME
                    }
                ],
                Value:info.time[0]*1000000+info.time[1]/1000 
            })
        })

        cloudwatch.putMetricData(params,
        function(err,data){
            err ? reject(err) : resolve()
        })
    })
}
