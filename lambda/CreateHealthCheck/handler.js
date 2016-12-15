var process=require('./process.js')

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var responseMod=require('./response.js')
    var response=new responseMod(event,context)
    var handled=false

    process.destory(event)
        .then(function(data){
            console.log("Destroy Success")
            return process.create(event)
        },function(err){
            console.log("Destroy Error")
            console.log(err)
            handled=true
            return response.fail(err)
        })
            .then(function(data){
                console.log("Create Success")
                return response.succeed(data)
            },function(err){
                if(!handled){
                    console.log("Create Error")
                    return response.fail(err)
                }
            }) 
    
};

