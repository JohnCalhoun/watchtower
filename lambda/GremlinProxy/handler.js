var process=require('./process.js')
var request=require('request')

exports.handler = function(event, context,callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    var script=event.body.script
    var gremlinUrl="https://"+event.stageVariables.server
        
    request.post(
        gremlinUrl,
        script,
        function(err,response,body){
            if(err){
                callback("ERROR"+err)
            }else{
                if(body.status.code===200){
                    callback(null,body.result)
                }else{
                    callback("ERROR"+body.status.message)
                }
            }
        })
};

