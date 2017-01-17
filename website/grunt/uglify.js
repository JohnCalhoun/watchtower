module.exports={
    dist:{
        options:{
            compress:{
                global_defs:{
                }
            }
        },
        files:{
            "build<%= js %>":['tmp/main.js']
        }
    }
}
