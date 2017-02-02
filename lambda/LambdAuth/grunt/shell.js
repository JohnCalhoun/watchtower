module.exports={
    startMySQL:{
        command:[
                "$(docker ps | grep <%= containerName %> >/dev/null)",
                "||",
                'echo "$(docker run --name <%= containerName %> -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<%= DBPassword %> -d mysql:5.7;sleep 20;)"'
                ].join(' ')
    },
    stopMySQL:{
        command:"docker kill <%= containerName %>;docker rm <%= containerName %>"
    },
    mysql:{
        command:'echo "mysql -u root -p<%= DBPassword %> -h 127.0.0.1"'
    }
}










