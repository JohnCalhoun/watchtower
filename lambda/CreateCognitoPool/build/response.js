var https=require("https"),url=require("url");module.exports=function(a,b){this.succeed=function(b){if(console.log("data",b),b){var c=b.UserPool.Id;JSON.stringify({Status:"SUCCESS",PhysicalResourceId:c,StackId:a.StackId,RequestId:a.RequestId,LogicalResourceId:a.LogicalResourceId})}else{JSON.stringify({Status:"SUCCESS",PhysicalResourceId:"empty",StackId:a.StackId,RequestId:a.RequestId,LogicalResourceId:a.LogicalResourceId})}},this.fail=function(b){console.log(b);JSON.stringify({Status:"FAILED",Reason:"Error: "+b.toString(),PhysicalResourceId:"empty",StackId:a.StackId,RequestId:a.RequestId,LogicalResourceId:a.LogicalResourceId})}};