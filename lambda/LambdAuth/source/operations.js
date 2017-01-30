var mysql=require('mysql')
var sql=require('sql')
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
        connect()
        .then(
            function(conn){
                conn.query(
                    query.text,
                    query.values,
                    function(err,results){
                        conn.end()
                        if(err){
                            reject(err)
                        }else{
                            resolve(results)
                        }
                    }
                )
            }
        )
    })
}

exports.get=function(id){
    var query=users
        .select(
            users.star()
        )
        .from(users)
        .where(users.id.equals(id)).toQuery()

    var out=run_query(query)
    .then(function(result){
        return(result[0])
    })

    return out
}

exports.create=function(id,email,salt,verifier,group){
    var query=users
        .insert(
            users.id.value(id),
            users.email.value(email),
            users.reset.value(1),
            users.salt.value(salt),
            users.type.value(group),
            users.verifier.value(verifier)
        ).toQuery()

    var out=run_query(query)
    .then(function(result){
        return null
    })

    return out
}

exports.update=function(id,data){
    var query=users
        .update(data)
        .where(
            users.id.equals(id)
        ).toQuery()
    
    var out=run_query(query)
    .then(function(result){
        return null
    })

    return out
}

exports.remove=function(id){
    var query=users
        .delete()
        .where(users.id.equals(id)).toQuery()
    
    var out=run_query(query)
    .then(function(result){
        return null
    })
    return out
}




