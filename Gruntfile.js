module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    })

    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    

    grunt.registerTask('lambda',[
        'clean:lambda', 
        'uglify:createcognitopool',
        'lambda_package:createcognitopool',
        'shell:moveLambda'
    ])
    grunt.registerTask('runpool',[
        'lambda',
        'env:dev',
        'lambda_invoke:createcognitopool'
    ])


    grunt.registerTask('cloudformation',[
        'concat:resources',
        'concat:cloudformation'
    ])
    
    grunt.registerTask('stackup',[
        'cloudformation',
        'shell:updateStack'])

    grunt.registerTask('stack',[
        'cloudformation',
        'shell:createStack'])

    grunt.registerTask('stackrm',[
        'shell:deleteStack'])

    grunt.registerTask('upload',[
        'cloudformation',
        'shell:uploadCloudFormation'
    ])
    grunt.registerTask('val',[
        'cloudformation',
        'shell:validate'
    ])
}







