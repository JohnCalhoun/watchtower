module.exports={
    options: {
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '<%= DBPassword %>',
            multipleStatements: true
        }
    },
    init: {
        src: ['tmp/init.sql']
    },
    clear:{
        src: ['tmp/clear.sql']
    },
    auth:{
        src: ['tmp/auth.sql']
    }
}
