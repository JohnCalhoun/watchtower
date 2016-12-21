var process=require('./process.js')
var request=require('request')

exports.handler = function(event, context,callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var params={
        url:"http://"+event.server,
        json:{
            gremlin:event.script
        }}

    if(event.bindings!==""){ 
        params.json.bindings=event.bindings
    }
    console.log(params)

    request.post(
        params,
        function(err,response,body){
            console.log(response)
            console.log(body)
            console.log(err)
            if(err){
                callback("ERROR"+err)
            }else{
                if(body.status.code===200){
                    callback(null,body)
                }else{
                    callback("ERROR"+body.status.message)
                }
            }
        }
        )
};

