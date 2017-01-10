var process=require('./process.js')
var request=require('request')
var fs=require('fs')
var sql=require('mysql')
var val=require('jsonschema').validate

function runscript(name,bindings){
    user=process.env.DBUSER
    password=process.env.DBPASSWORD
    endpoint=process.env.DBENDPOINT
    database=process.env.DBNAME

    //load in script
    script=fs.readFileSync(source_dir+'/scripts/'+name+'.sql').toString()
    schema=JSON.parse(fs.readFileSync(source_dir+'/scripts/'+name+'.json'))

    var out=new Promise(function(resolve,reject){ 
        console.log(val(bindings,schema))
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
            bindings,
            function(err, result) {
                if (err) reject(err);
                resolve(result) 
            }
        );
        connection.end(); 
    })

    return out
}

exports.handler = function(event, context,callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    body=JSON.parse(event.body) 
   
    script=body.script
    bindings=body.bindings

    result=runscript(script,bindings)

    result.then(function(data){
        context.succed(data)
    },function(err){
        context.fail(data)
    })
};

