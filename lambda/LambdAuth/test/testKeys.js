var crypto=require('crypto')
var rsa=require('node-rsa')
var Promise=require('bluebird')
var fs=require('fs')

var config=require('./config.json')

var key=new rsa({b:256})
key.generateKeyPair()

var priv=key.exportKey('private')
var pub=key.exportKey('public')

config.privateKey=priv, 
config.publicKey=pub

fs.writeFile(
    './config.json',
    JSON.stringify(config,null,5)
    )





