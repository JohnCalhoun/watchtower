module.exports=function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    })
    
    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
        
    grunt.registerTask('html',
        [
        'clean:build'
        ,'shell:metalsmith'
    ])

    grunt.registerTask('Clean',
        ['clean:build']
    );
    grunt.registerTask('server',[
        'connect:dev' 
    ]); 
    grunt.registerTask('view',[
        'core-build',
        'connect:dev'
    ])
    grunt.registerTask('style',["sass:style",
                                "autoprefixer:style",
                                "cssmin:style"])
  
    grunt.registerTask('js',[
        "copy:sdk",
        "copy:CryptoJS",
        "copy:cognitoSdk", 
        "browserify:dist",
        "uglify:dist"
    ])
   

    grunt.registerTask('core-build',[
            'html',
            'style',
            'js'
        ]);
    
    grunt.registerTask('testBuild',[
                                'browserify:testConstants'
                                ,'browserify:testRoutes'
                                ]) 
    
 
    grunt.registerTask('test',[ 'connect:js',
                                'testBuild',
                                'start-selenium-server:dev', 
                                'force:webdriver:dev',
                                'stop-selenium-server:dev']) 

    grunt.registerTask('buildFull',
        ['build',
        'connect:build',
        'testBuild',
        'start-selenium-server:dev', 
        'force:shell:generateFull',
        'stop-selenium-server:dev'
        ])

    grunt.registerTask('build',[
        'Clean',
        'core-build'
    ]);

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

}







