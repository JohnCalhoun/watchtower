var process=require('./process.js')

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var responseMod=require('./response.js')
    var response=new responseMod(event,context)

    process.destory(event)
        .then(function(data){
            console.log("Destroy Success")
            process.create(event)
                .then(function(data){
                    console.log("Create Success")
                    response.succeed(data)
                },function(err){
                    console.log("Create Error")
                    response.fail(err)
                })
        },function(err){
            console.log("Destroy Error")
            response.fail(err)
        })
};

