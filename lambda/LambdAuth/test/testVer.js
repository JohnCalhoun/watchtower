process.env.REGION='us-east-1'

var Promise=require('bluebird')
var require_helper=require('./require_helper.js')

var SRP = require_helper('SRP/srp.js')('modp14',1024,64)
var client = require_helper('SRP/client.js')('modp14',1024,64)
var srp = require_helper('srp.js')('modp14');
var fs=require('fs')

var faker=require('faker')
var username=faker.internet.userName()
var password=faker.internet.password()

var material=srp.genVerifier(username,password) 
var A=client.genA()

var config=require('./config.json')
config.salt=material.salt.toString('hex')
config.verifier=material.v.toString('hex')
config.A=A.A.toString('hex')
config.username=username
config.password=password

fs.writeFile(
    './config.json',
    JSON.stringify(config,null,5)
    )
