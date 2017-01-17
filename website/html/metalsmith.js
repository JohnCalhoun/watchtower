var Metalsmith=require('metalsmith')
var layouts=require('metalsmith-layouts')
var markdown=require('metalsmith-markdown')
var ignore=require('metalsmith-ignore')
var config=require('../config.json')

Metalsmith(__dirname)
    .metadata(config)
    .source('./content')
    .destination('../build')  
    .use(ignore([])) 
    .use(markdown())
    .use(layouts({
        engine:"handlebars",
        directory:"./layouts",
        partials:"./partials",
        pattern:"*"
    }))
    .use(function(files,meta,done){
        //console.log(files)
        done()
    })
    .build(function(err,files){
        console.log('finished')
        console.log(err)
    })

