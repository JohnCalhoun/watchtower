var srp=require('./srp.js')
var role=require('./role.js')
var crypto=require('crypto')
var algorithm='aes-256-ctr'

exports.handler = function(event, context,callback) {
    console.log('Received event:', JSON.stringify(event, null, 2));
    var body=JSON.parse(event.body)
    var user=body.user
    var B=body.B

    srp.getSharedKey(B,user)
    .then(function(result){
        role.getCredentials(result.arn,user)
        .then(function(credentials){
            var cipher=crypto.createCipher(algorithm,result.sharedKey)
            var ciphertext=cipher.update(JSON.stringify(credentials),'utf8','hex')
            ciphertext+=cipher.final('hex')

            out={
                algorith:algorithm,
                credentials:ciphertext,
                salt:result.salt,
                A:result.publicKey
            }
            callback(null,out)
        },
        function(err){
            callback(err)
        })
    },
    function(err){
        callback(err)
    })
}
