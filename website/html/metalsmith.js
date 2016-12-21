var Metalsmith=require('metalsmith')
var config=require('../../config.json')
var ignore=require('metalsmith-ignore')
var layouts=require('metalsmith-layouts')

Metalsmith(__dirname)
    .metadata(config)
    .source('.')
    .destination('../build')  
    .use(ignore(['layouts/*','plugins/*','partials/*','metalsmith.js','content/*'])) 
    .use(layouts({
        engine:"handlebars",
        directory:"./layouts",
        partials:"./partials"
    })) 
    .build(function(err,files){
        console.log('finished')
        console.log(err)
    })

