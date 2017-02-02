var fs=require('fs')

module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    })

    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });

    grunt.registerTask('val',['shell:validate'])
    
    grunt.registerTask('stack',['cloudformation:create'])
    grunt.registerTask('stackrm',['cloudformation:remove'])

    grunt.registerTask('snapshot',[
        'mysqlrunfile',
        'shell:snapshot'
    ])
}











