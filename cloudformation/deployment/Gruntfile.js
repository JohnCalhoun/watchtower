var crypto=require('crypto')

module.exports=function(grunt){
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    
    require('load-grunt-config')(grunt,{
        data:grunt.file.readJSON('config.json')
    });
    
    grunt.registerTask('keygen',function(){
        grunt.config.set("DBMasterPassword",      DBPassword=crypto.randomBytes(20).toString('hex'))
        grunt.config.set("DBPasswordRead",      DBPassword=crypto.randomBytes(20).toString('hex'))
        grunt.config.set("DBPasswordWrite",      DBPassword=crypto.randomBytes(20).toString('hex'))
    })
  
    grunt.registerTask('getGitClone',function(){
        var url=exec("git remote get-url origin | sed 's/ssh/https/'").toString()
        grunt.config.set('GitCloneUrl',url)
    })
   
    grunt.registerTask('cloudformation',[
        'concat:resources',
        'concat:cloudformation'
    ])
    
    grunt.registerTask('stack',[
        'keygen',
        'getGitClone',
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







