module.exports=function(message,severity){
    if(process.env.LOG_LEVEL<severity){
        console.log(message)
    }
}
