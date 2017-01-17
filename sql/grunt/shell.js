module.exports={
    copyInitSql:{
        command:[
            'cp scripts/init-*.scripts ../lambda/InitDataBase/build',
            'cp scripts/read-*.scripts ../lambda/RDSProxy/build',
            'cp scripts/write-*.scripts ../lambda/RDSProxy/build'
        ].join(';')
    },
    startMySQL:{
        command:[
                "$(docker ps | grep <%= containerName %> >/dev/null)",
                "||",
                'echo "$(docker run --name <%= containerName %> -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<%= DBPassword %> -d mysql:8.0;sleep 20;)"'
                ].join(' ')
    },
    stopMySQL:{
        command:"docker kill <%= containerName %>;docker rm <%= containerName %>"
    },
    testSQL:{
        command:"export MYSQL_PORT=3306;export MYSQL_PASSWORD=<%= DBPassword %>;cd sql; ./test.py"
    }
}


