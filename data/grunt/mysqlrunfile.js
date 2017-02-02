module.exports={
    options: {
        connection: {
            host: 'tmpDB.jmc.ninja',
            user: 'root',
            password: '<%= DBPassword %>',
            database: 'test',
            multipleStatements: true
        }
    },
    init: {
        src: ['scripts/*.sql']
    }
}
