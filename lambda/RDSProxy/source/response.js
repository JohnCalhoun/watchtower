var https = require("https");
var url = require("url");


module.exports=function(event,context){
    function send(responseBody){
        var parsedUrl = url.parse(event.ResponseURL);

        var options = {
            hostname: parsedUrl.hostname,
            port: 443,
            path: parsedUrl.path,
            method: "PUT",
            headers: {
                "content-type": "",
                "content-length": responseBody.length
            }
        };
     
        var request = https.request(options, function(response) {
            console.log("STATUS: " + response.statusCode);
            console.log("HEADERS: " + JSON.stringify(response.headers));
            context.succeed();
        });
     
        request.on("error", function(error) {
            console.log("sendResponse Error:" + error);
            context.fail(error);
        });
        console.log(responseBody)
        request.write(responseBody);
        request.end();
    }
     
    this.succeed=function(data){
        console.log('data',data)
        if(data){
            var ID="s3://"+event.ResourceProperties.destbucket+'/'+event.ResourceProperties.destkey
            var responseBody = JSON.stringify({
                Status:"SUCCESS" ,
                PhysicalResourceId:ID,
                StackId: event.StackId,
                RequestId: event.RequestId,
                LogicalResourceId: event.LogicalResourceId,
            });
            send(responseBody)
        }else{
            var responseBody = JSON.stringify({
                Status:"SUCCESS" ,
                PhysicalResourceId:"empty",
                StackId: event.StackId,
                RequestId: event.RequestId,
                LogicalResourceId: event.LogicalResourceId,
            });
            send(responseBody)
        }
    }
    this.fail=function(err){
        var responseBody = JSON.stringify({
            Status:"FAILED",
            Reason: "Error: "+err.toString(),
            PhysicalResourceId:"empty",
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId
        });
        send(responseBody) 
    } 
}
