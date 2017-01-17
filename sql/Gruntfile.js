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

    grunt.registerTask('sql',[
        "shell:startMySQL",
        "shell:testSQL"
    ])
}







