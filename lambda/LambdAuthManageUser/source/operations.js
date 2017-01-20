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

var run_query=function(query){
    return new Promise(function(resolve,reject){
        connect().then(
            function(conn){
                conn.query(
                    query.text,
                    query.values,
                    function(err,results){
                        if(err){reject(err)}else{
                            resolve(results)
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

exports.get=function(id){
    return new Promise(function(resolve,reject){
        var query=users
            .select(users.star())
            .from(users)
            .where(users.id.equals(id)).toQuery()

        run_query(query)
        .then(
            function(result){
                resolve(result[0])
            },
            function(err){
                reject(err)
            }
        )
    })
}

exports.create=function(id,salt,verifier,arn){
    return new Promise(function(resolve,reject){
        var query=users
            .select(users.star())
            .from(users)
            .where(users.id.equals(id)).toQuery()

        run_query(query)
        .then(
            function(result){
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
        var query=users
            .select(users.star())
            .from(users)
            .where(users.id.equals(id)).toQuery()

        run_query(query)
        .then(
            function(result){
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
        var query=users
            .select(users.star())
            .from(users)
            .where(users.id.equals(oldId)).toQuery()

        run_query(query)
        .then(
            function(result){
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
        var query=users
            .select(users.star())
            .from(users)
            .where(users.id.equals(id)).toQuery()

        run_query(query)
        .then(
            function(result){
                resolve()
            },
            function(err){
                reject(err)
            }
        )
    })
}




