var aws=require('aws-sdk')
var crypto=require('crypto')

var config_file=__dirname+'/../config.json'
var config=require(config_file)

config.DBPassword=crypto.randomBytes(10).toString('hex')
config.DBPasswordRead=crypto.randomBytes(10).toString('hex')
config.DBPasswordWrite=crypto.randomBytes(10).toString('hex')

fs.writeFileSync(config_file,JSON.stringify(config,null,2))


