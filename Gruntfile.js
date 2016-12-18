module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    })

    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    grunt.registerTask('upload',[
        "shell:uploadServerAssets"
    ])

    grunt.registerTask('lambda',[
        'clean:lambda', 
        'uglify:createcognitopool',
        'uglify:createcognitoidentity',
        'uglify:createhealthcheck',
        'uglify:createswfdomain',
        'uglify:createswfworkflow',
        'uglify:createswfactivity',
        'lambda_package:createcognitopool',
        'lambda_package:createcognitoidentity',
        'lambda_package:createhealthcheck',
        'lambda_package:createswfdomain',
        'lambda_package:createswfworkflow',
        'lambda_package:createswfactivity',
        'shell:moveLambda'
    ])
    grunt.registerTask('runact',[
        'lambda',
        'env:dev',
        'lambda_invoke:createswfactivity'
    ])
    grunt.registerTask('runflow',[
        'lambda',
        'env:dev',
        'lambda_invoke:createswfworkflow'
    ])
    grunt.registerTask('rundomain',[
        'lambda',
        'env:dev',
        'lambda_invoke:createswfdomain'
    ])
    grunt.registerTask('runpool',[
        'lambda',
        'env:dev',
        'lambda_invoke:createcognitopool'
    ])
    grunt.registerTask('runid',[
        'lambda',
        'env:dev',
        'lambda_invoke:createcognitoidentity'
    ])

    grunt.registerTask('cloudformation',[
        'concat:resources',
        'concat:cloudformation',
        'shell:packageStack'
    ])
    
    grunt.registerTask('stackup',[
        'stack'
    ])

    grunt.registerTask('stack',[
        'cloudformation',
        'shell:createStack'])

    grunt.registerTask('stackrm',[
        'shell:deleteStack'])

    grunt.registerTask('val',[
        'cloudformation',
        'shell:validate'
    ])
}







