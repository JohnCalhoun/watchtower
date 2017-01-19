process.env.REGION='us-east-1'

var create=require('./create.js')
var update=require('./update.js')
var del=require('./delete.js')
var config=require('../config.json')
var mysql=require('mysql')
var aws=require('aws-sdk')
var kms=new aws.KMS({region:process.env.REGION})

process.env.DB_ENDPOINT="127.0.0.1"
process.env.DB_USER="root"
process.env.DB_PASSWORD=config.DBPassword
process.env.DB_NAME='test'
process.env.KMS_KEY=config.keyArn

var testCreateTable = function(test) {
    params={
        TableName:"testtable",
        TableSchema:[{name:'column1',dataType:'int'}]
    }
    process.env.CR_TYPE='table'

    test.expect(3);
    create(params,
        function(err,id,data){
            test.ifError(err) 
            test.equal(id,params.TableName)
            var connection=mysql.createConnection({
                host:process.env.DB_ENDPOINT,
                user:process.env.DB_USER,
                password:process.env.DB_PASSWORD,
                database:process.env.DB_NAME
            })
                
            connection.query(
            "SELECT * FROM "+params.TableName, 
            function(err){
                test.ifError(err,"Table Should exists")
                test.done();
            });
            connection.end()
        })
};

var testCreateUser = function(test) {
    params={
        UserName:"write"
    }
    process.env.CR_TYPE='user'

    test.expect(4);
    create(params,
        function(err,id,data){
            test.equal(id,params.UserName,"should create a user id as pyshical id") 
            test.ok(data.password,"should create a user password") 
            
            kms.decrypt(
                {
                    CiphertextBlob:data.password,
                    EncryptionContext:{
                        user:id
                    }
                },
                function(err,DecryptedData){
                    test.ifError(err,"Should be able to decrypt password")
                    var connection2=mysql.createConnection({
                        host:process.env.DB_ENDPOINT,
                        user:id,
                        password:DecryptedData.Plaintext
                    })
                        
                    connection2.connect(function(err){
                        test.ifError(err,"Login should work")
                        var connection=mysql.createConnection({
                            host:process.env.DB_ENDPOINT,
                            user:process.env.DB_USER,
                            password:process.env.DB_PASSWORD,
                            database:process.env.DB_NAME
                        })
                            
                        connection.query(
                            "DROP USER IF EXISTS "+params.UserName,
                            function(err){
                                test.done();
                            }
                        );
                        connection.end()
                    });
                    connection2.end()
                }
            )
        })
};

var testCreatePrivilege = function(test) {
    params={
        UserWrite:true,
        UserTableAccess:"tmp",
        UserName:"tmpUser"
    }
    process.env.CR_TYPE='privilege'

    test.expect(2);
    create(params,
        function(err,id,data){
            test.ok(id,"should create a privilege id as pyshical id") 
            test.ifError(err,"should be no error") 
            test.done() 
        });
};

var testdeleteprivilege = function(test) {
    params={}
    process.env.CR_TYPE='privilege'
    
    id="tmpUser|write|tmp"
    test.expect(1);

    del(id,params,
        function(err,id,data){
            test.ifError(err,"should be no error") 
            test.done() 
        });

};

var testdeleteuser = function(test) {
    params={}
    process.env.CR_TYPE='user'
    id=""

    test.expect(1);
    del(id,params,
        function(err,id,data){
            test.ifError(err,"should be no error") 
            test.done() 
        });

};

var testdeletetable = function(test) {
    params={}
    process.env.CR_TYPE='table'
    id="tmp"
    test.expect(1);
    del(id,params,
        function(err,id,data){
            test.ifError(err,"should be no error") 
            test.done() 
        });

};

var testupdatetable = function(test) {
    params={
        TableName:"tmp",
        TableSchema:[{name:'column1',dataType:'float'}]
    }
    process.env.CR_TYPE='table'
    test.expect(1);
    
    update("tmp",params,{},
         function(err,id,data){
            test.ifError(err,"should be no error") 
            test.done() 
        }
    );
};

var testupdateuser = function(test) {
    params={
        UserName:"write"
    }
    process.env.CR_TYPE='user'
    test.expect(1);
    
    update(params.UserName,params,{},
         function(err,id,data){
            test.ifError(err,"should be no error") 
            test.done() 
        }
    );
};

var testupdateprivilege = function(test) {
    params={
        UserWrite:false,
        UserTableAccess:"tmp",
        UserName:"tmpUser"
    }
    process.env.CR_TYPE='user'
    test.expect(1);
    ID="tmpUser|write|tmp"
    update(ID,params,{},
         function(err,id,data){
            test.ifError(err,"should be no error") 
            test.done() 
        }
    );
};

module.exports={
    setUp:function(callback){
        var connection=mysql.createConnection({
                host:process.env.DB_ENDPOINT,
                user:process.env.DB_USER,
                password:process.env.DB_PASSWORD,
                multipleStatements:true
            })
     
        connection.query(
            [   
                "CREATE DATABASE IF NOT EXISTS "+process.env.DB_NAME,
                "CREATE USER IF NOT EXISTS tmpUser",
                "CREATE TABLE IF NOT EXISTS `"+process.env.DB_NAME+"`.`tmp` (column1 int,column2 int)",
                "GRANT SELECT ON `"+process.env.DB_NAME+"`.`tmp` TO tmpUser"
            ].join(';'),
            function(err){
                callback() 
            }
        )

    },
    tearDown:function(callback){
        var connection=mysql.createConnection({
                host:process.env.DB_ENDPOINT,
                user:process.env.DB_USER,
                password:process.env.DB_PASSWORD,
                multipleStatements:true
            })
        connection.query(
            [
                "DROP TABLE IF EXISTS `"+process.env.DB_NAME+"`.`tmp`",
                "DROP TABLE IF EXISTS `"+process.env.DB_NAME+"`.`testtable`",
                "DROP USER IF EXISTS tmpUser",
                "DROP USER IF EXISTS 'write'",
                "DROP DATABASE IF EXISTS `"+process.env.DB_NAME+"`"
            ].join(';'),
            function(err){
                callback() 
            }
        )
        
        connection.end()
    },

    testCreateTable:testCreateTable,
    testCreateUser:testCreateUser,
    testCreatePrivilege:testCreatePrivilege,

    testDeleteUser:testdeleteuser,
    testDeleteTable:testdeletetable,
    testDeletePrivilege:testdeleteprivilege,
    
    testupdateuser:testupdateuser,
    testupdatetable:testupdatetable,
    testupdateprivilege:testupdateprivilege
}

