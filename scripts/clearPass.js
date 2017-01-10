var config_file=__dirname+'/../config.json'
var config=require(config_file)

config.DBPassword=""
config.DBPasswordRead=""
config.DBPasswordWrite=""

fs.writeFileSync(config_file,JSON.stringify(config,null,2))


