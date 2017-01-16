module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    
    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    
    grunt.registerTask('cloudformation',[
        'concat:resources',
        'concat:cloudformation'
    ])
    
    grunt.registerTask('stack',[
        'cloudformation', 
        'shell:createStack'])

    grunt.registerTask('stackup',[
        'cloudformation', 
        'shell:updateStack']) 

    grunt.registerTask('stackrm',[
        'force:deletestack'])
    
    grunt.registerTask('val',[
        'cloudformation',
        'shell:validateStack'])
}







