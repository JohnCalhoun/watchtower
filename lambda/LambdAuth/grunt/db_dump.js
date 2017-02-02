module.exports={
    auth:{
        options: {
            title: "auth_init",

            database: "auth",
            user: "root",
            pass: "<%= DBPassword %>",
            host: "127.0.0.1",

            backup_to: "tmp/auth.sql"
        }
    }
}
