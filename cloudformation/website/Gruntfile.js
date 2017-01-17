module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    
    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    
    grunt.registerTask('getGitClone',function(){
        var url=exec("git remote get-url origin | sed 's/ssh/https/'").toString()
        grunt.config.set('GitCloneUrl',url)
    })
   
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

    grunt.registerTask('deletestack',[
        'shell:deleteStack'])
 
    grunt.registerTask('stackrm',[
        'force:deletestack'])
    
    grunt.registerTask('val',[
        'cloudformation',
        'shell:validateStack'])
}







