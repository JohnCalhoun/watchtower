var aws=require('aws-sdk')
var Promise=require('bluebird')
var cloudwatch=new aws.CloudWatch({region:process.env.REGION})

exports.levels={
    "info":0,
    "warn":100,
    "error":200,
    "fatal":300
}

exports.log=function(message,severity){
    if(exports.levels[process.env.LOG_LEVEL]<=severity){
        console.log(message)
    }
}

exports.metric=function(action,times){
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
