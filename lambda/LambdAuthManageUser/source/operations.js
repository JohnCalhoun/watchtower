var mysql=require('mysql')
var sql=require('sql')
var jsrp=require('jsrp')

sql.setDialect('mysql')

var userTable=sql.define({
    name:'users',
    columns:[
        {
            name:"id",
            dataType:"text"
        },
        {
            name:"salt",
            dataType:"text"
        },
        {
            name:"verifier",
            dataType:"text"
        },
        {
            name:"arn",
            dataType:"text"
        }
    ]
})

exports.get=function(id){
    return new Promise(function(resolve,reject){
        //build query
        //send query
        //parse result
        resolve()
    })
}

exports.create=function(id,password){
    return new Promise(function(resolve,reject){
        //build query
        //send query
        //parse result
        resolve()
    })
}

exports.changePassword=function(id,password){
    return new Promise(function(resolve,reject){
        //build query
        //send query
        //parse result
        resolve()
    })
}

exports.changeId=function(oldId,newId){
    return new Promise(function(resolve,reject){
        //build query
        //send query
        //parse result
        resolve()
    })
}

exports.remove=function(id){
    return new Promise(function(resolve,reject){
        //build query
        //send query
        //parse result
        resolve()
    })
}




