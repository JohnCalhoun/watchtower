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
        "shell:uploadServerAssets",
        "shell:uploadLambda"
    ])
    grunt.registerTask('sdk',[
        "shell:getSdk",
        "concat:sdk",
        "uglify:sdk"
    ])
    grunt.registerTask('lambda',[
        'clean:lambda', 
        'uglify:createcognitopool',
        'uglify:createcognitoidentity',
        'uglify:createhealthcheck',
        'uglify:gremlinproxy',
        'lambda_package:createcognitopool',
        'lambda_package:createcognitoidentity',
        'lambda_package:createhealthcheck',
        'lambda_package:gremlinproxy',
        'shell:moveLambda',
        'shell:uploadLambda'
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
        'concat:cloudformation'
    ])
    
    grunt.registerTask('stackup',[
        'cloudformation',
        'shell:updateStack'
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







