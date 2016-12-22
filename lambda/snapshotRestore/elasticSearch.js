var request=require('request')

exports.registerRepo = function(){
    var params={
        url:[
            "http://"+endpoint,
            "_snapshot",
            repo,
            snapshot].join('/')
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
                callback(null,body)
            }
        }
    )

}
exports.snapshot = function(){
    var params={
        url:[
            "http://"+endpoint,
            "_snapshot",
            repo,
            snapshot].join('/')
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
                callback(null,body)
            }
        }
    )
}
exports.register = function(){
    var paramsDelete={
        url:[
            "http://"+endpoint,
            "_all"
            ].join('/')
        }
    console.log(params)
    request.delete(
        paramsDelete,
        function(err,response,body){
            console.log(response)
            console.log(body)
            console.log(err)
            if(err){
                callback("ERROR"+err)
            }else{
                var paramsRestore={
                    url:[
                        "http://"+endpoint,
                        "_snapshot",
                        repo,
                        "snapshot",
                        "_restore"
                        ].join('/')
                    }
                request.post(
                    paramsRestore,
                    function(err,response,body){
                        console.log(response)
                        console.log(body)
                        console.log(err)
                        if(err){
                            callback("ERROR"+err)
                        }else{
                            callback(null,body)
                        }
                    }
                ) 
            }
        }
        )
    }
}


