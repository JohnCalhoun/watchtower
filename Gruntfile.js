var crypto=require('crypto')
var exec=require('child_process').execSync

module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    })

    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    
    grunt.registerTask('keygen',function(){
        grunt.config.set("DBPassword",      DBPassword=crypto.randomBytes(20).toString('hex'))
        grunt.config.set("DBPasswordRead",  DBPassword=crypto.randomBytes(20).toString('hex'))
        grunt.config.set("DBPasswordWrite", DBPassword=crypto.randomBytes(20).toString('hex'))
    })
    grunt.registerTask('lambda',[
        "shell:buildLambda", 
        "copy:lambda",
        "shell:uploadLambda"
        ])

    grunt.registerTask('cloudformation',[
        "copy:cloudformation",
        "shell:uploadCloudformation"
        ])
    grunt.registerTask('sql',[
        "shell:AuthScript",
        "copy:sql"
    ])
}







