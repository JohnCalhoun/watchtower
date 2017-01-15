var sql=require('mysql')
var fs=require('fs')

function run(name,resolve,reject){
    user=process.env.DBUSER
    password=process.env.DBPASSWORD
    endpoint=process.env.DBENDPOINT
    database=process.env.DBNAME

    //load in script
    script=fs.readFileSync(__dirname+'/'+name+'.sql').toString()

    var connection = sql.createConnection({
        host     : endpoint,
        user     : user,
        password : password,
        database : database,
        ssl      : "Amazon RDS",
        multipleStatements: true
    });
    connection.connect();
    
    connection.query(
        script.replace(
            'database', 
            connection.escapeId(database)         
        ),
        function(err, result) {
            if (err) reject(err);
            resolve() 
        }
    );
    connection.end(); 
}

module.exports.create=function(event){   
    var out=new Promise(function(resolve,reject){ 
        if(event.RequestType==="Create" | event.RequestType==="Update"){
            run('create',resolve,reject) 
        }else{
            resolve()
        }
    })
    return out
}
module.exports.destory=function(event){
    var out=new Promise(function(resolve,reject){
        if(event.RequestType==="Delete" | event.RequestType==="Update"){
            run('destory',resolve,reject) 
        }else{
            resolve()
        }
    })
    return out
}
