var mysql=require('mysql')
var sql=require('sql')
var jsrp=require('jsrp')
var connect=require('./connect.js')

sql.setDialect('mysql')

var users=sql.define({
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
        var query=users
            .select(users.star())
            .from(users)
            .where(users.id.equals(id)).toQuery()
        
        connect().then(
            function(conn){
                conn.query(
                    query.text,
                    query.values,
                    function(err,results){
                        if(err){reject(err)}else{
                            resolve(results[0])
                        }
                    }
                )
            },
            function(err){
                reject(err)
            }
        )
    })
}

exports.create=function(id,salt,verifier,arn){
    return new Promise(function(resolve,reject){
        //jsrp init 
        //build slat and verifier
        //build query
        connect().then(
            function(conn){
                conn.end()
                //parse result
                //send query
                resolve()
            },
            function(err){
                reject(err)
            }
        )
    })
}

exports.changePassword=function(id,salt,verifier){
    return new Promise(function(resolve,reject){
        //build query
        //
        connect().then(
            function(conn){
                conn.end()
                //parse result
                //send query
                resolve()
            },
            function(err){
                reject(err)
            }
        )
    })
}

exports.changeId=function(oldId,newId){
    return new Promise(function(resolve,reject){
        //build query
        connect().then(
            function(conn){
                conn.end()
                //send query
                //parse result
                resolve()
            },
            function(err){
                reject(err)
            }
        )
    })
}

exports.remove=function(id){
    return new Promise(function(resolve,reject){
        //build query
        connect().then(
            function(conn){
                conn.end()
                //send query
                //parse result
                resolve()
            },
            function(err){
                reject(err)
            }
        )
    })
}




