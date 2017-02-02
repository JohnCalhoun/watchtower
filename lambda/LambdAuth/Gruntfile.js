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

    grunt.registerTask('coverage',[
        'env:coverage',
        'instrument',
        'copy:coverage',
        'test',
        "storeCoverage",
        "makeReport"
    ])
    
    grunt.registerTask('delscript',function(){
        fs.unlinkSync('./tmp/init.sql')
        fs.unlinkSync('./tmp/clear.sql')
    })
     
    grunt.registerTask('db',function(){ 
        var prepend=require('prepend-file')
        prepend.sync('./tmp/auth.sql','CREATE DATABASE auth;USE auth;\n')
        prepend.sync('./tmp/auth.sql','DROP DATABASE IF EXISTS auth;\n')
    })

    
    grunt.registerTask('table',function(){
        var sql=require('sql')
        var ops=require('./source/operations.js')

        var table=ops.db
        var create_table=table.create().ifNotExists().toString()+';\n' 
        
        fs.appendFileSync('./tmp/init.sql','CREATE DATABASE auth;USE auth;')
        fs.appendFileSync('./tmp/clear.sql','DROP DATABASE auth;')
        fs.appendFileSync('./tmp/init.sql',create_table)
    })

    grunt.registerTask('adminaccount',function(){
        var username='admin'
        var password='password'
        var email='johnmcalhoun123@gmail.com'

        var ops=require('./source/operations.js')
        var SRP = require('./source/SRP/srp.js')('modp18',1024,64)
        var client = require('./source/SRP/client.js')('modp18',1024,64)
        var srp = require('./source/srp.js');
        
        var db=ops.db
        var material=srp.genVerifier(username,password) 
        
        var salt=material.salt.toString('hex')
        var verifier=material.v.toString('hex')
        
        var query=ops.db.insert(
            db.id.value(username),
            db.email.value(email),
            db.salt.value(salt),
            db.verifier.value(verifier),
            db.type.value('admin'),
            db.reset.value(false),
            db.mfaSecret.value(null),
            db.mfaEnabled.value(false)
        ).toString()+';\n'

        fs.appendFileSync('./tmp/init.sql',query)
    })

    grunt.registerTask('user',function(){
        var sql=require('sql')
        var ops=require('./source/operations.js')

        var table=ops.db
         
        var create=function(name,privilege){
            var out="DROP USER IF EXISTS '"+name+"';\n"
                    +"CREATE USER '"+name+"'@'%';\n"
                    +"GRANT "+privilege+" ON "+"auth"+"."+table._name+" TO '"+name+"'@'%';\n"
            fs.appendFileSync('./tmp/auth.sql',out)
        } 
        create('admin','select,update,insert') 
        create('auth','select') 
    })
    
    grunt.registerTask('dump',[
        "shell:startMySQL",
        'delscript',
        'table',
        'adminaccount',
        'mysqlrunfile:init',
        'db_dump:auth',
        'db',
        'user',
        'mysqlrunfile:clear',
        'mysqlrunfile:auth',
        'mysqlrunfile:clear'
    ])
}











