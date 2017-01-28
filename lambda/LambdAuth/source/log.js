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
