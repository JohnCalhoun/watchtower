var sql=require('mysql')
var fs=require('fs')


function run(name,resolve,reject){
    user=process.env.DBUSER
    password=process.env.DBPASSWORD
    endpoint=process.env.DBENDPOINT
    database=process.env.DBNAME

    //load in script
    script=fs.readFileSync(source_dir+'/scripts/'+name+'.sql').toString()

   var connection = mysql.createConnection({
        host     : endpoint,
        user     : user,
        password : password,
        database : database
    });

    connection.connect();

    connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

    connection.query(
        script, 
        {"database":database},
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
