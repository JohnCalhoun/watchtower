module.exports={
    build:{
        files:[
            {expand:true,src:["source/*.js","!source/test*.js"],dest:"build",flatten:true},
            {expand:true,src:["source/package.json"],dest:"build",flatten:true},
        ]
    }
}
