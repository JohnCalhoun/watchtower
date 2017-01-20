module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    })

    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });

    grunt.registerTask('build',[
        'copy:build',
        'lambda_package:lambda'
    ])

    grunt.registerTask('run',[
        'build',
        'env:lambda',
        'lambda_invoke:lambda'
    ])

    grunt.registerTask('test',[
        "shell:startMySQL",
        'nodeunit:all'
    ])
}







