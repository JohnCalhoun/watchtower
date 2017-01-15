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
    grunt.registerTask('getGitClone',function(){
        var url=exec("git remote get-url origin | sed 's/ssh/https/'").toString()
        grunt.config.set('GitCloneUrl',url)
    })

    grunt.registerTask('upload',[
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
        'uglify:rdsproxy',
        'shell:copyInitSql',
        'uglify:initdatabase',
        'lambda_package:createcognitopool',
        'lambda_package:createcognitoidentity',
        'lambda_package:createhealthcheck',
        'lambda_package:rdsproxy',
        'lambda_package:initdatabase',
        'shell:moveLambda',
        'shell:uploadLambda'
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
        'getGitClone',
        'concat:resources',
        'concat:cloudformation'
    ])
    
    grunt.registerTask('stackup',[
        'keygen',
        'cloudformation',
        'shell:updateStack'
    ])

    grunt.registerTask('stack',[
        'keygen',
        'cloudformation',
        'shell:createStack'])

    grunt.registerTask('stackrm',[
        'shell:deleteStack'])

    grunt.registerTask('val',[
        'cloudformation',
        'shell:validate'
    ])

    grunt.registerTask('html',[
        "shell:metalsmith"
    ])
    grunt.registerTask('style',[
        "sass:style",
        "autoprefixer:style",
        "cssmin:style"
    ])
    grunt.registerTask('cognito',[
        "shell:getCognitoSdk",
        "uglify:cognitoSdk",
        "concat:cognitoSdk"
    ])

    grunt.registerTask('sdk',[
        "shell:getSdk",
        "concat:sdk",
        "concat:CryptoJS",
        "uglify:sdk",
        "uglify:CryptoJS"
    ])
    
    grunt.registerTask('js',[
        "copy:sdk",
        "copy:CryptoJS",
        "copy:cognitoSdk", 
        "browserify:dist",
        "uglify:dist"
    ])
    grunt.registerTask('website',[
        "clean:website",
        "shell:favicon", 
        "html",
        "js",
        "style"
    ])
}







