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
            name:"email",
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
            name:"type",
            dataType:"text"
        },
        {
            name:"reset",
            dataType:"bool"
        },
        {
            name:"mfaSecret",
            dataType:"text"
        },
        {
            name:"mfaEnabled",
            dataType:"bool"
        }
    ]
})
exports.db=users

var run_query=function(query){
    return new Promise(function(resolve,reject){
        connect().then(
            function(conn){
                conn.query(
                    query.text,
                    query.values,
                    function(err,results){
                        conn.end()
                        if(err){reject(err)}else{
                            resolve(results)
                        }
                    }
                )
            },
            function(err){
                conn.end()
                reject(err)
            }
        )
    })
}

exports.get=function(id){
    return new Promise(function(resolve,reject){
        var query=users
            .select(
                users.star()
            )
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

exports.create=function(id,email,salt,verifier,group){
    
    return new Promise(function(resolve,reject){
        var query=users
            .insert(
                users.id.value(id),
                users.email.value(email),
                users.reset.value(1),
                users.salt.value(salt),
                users.type.value(group),
                users.verifier.value(verifier)
            ).toQuery()

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

exports.update=function(id,data){
    return new Promise(function(resolve,reject){
        var query=users
            .update(data)
            .where(
                users.id.equals(id)
            ).toQuery()

        run_query(query)
        .then(
            function(){
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
            .delete()
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




