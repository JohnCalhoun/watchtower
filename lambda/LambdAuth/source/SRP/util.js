var BigInteger = require('jsbn').BigInteger;
var createHash=require('create-hash')

exports.toN = function(number) {
    var thisHexString = number.toString(16);
    if (thisHexString.length % 2 === 1) {
        thisHexString = "0" + thisHexString;
    }
    return Buffer.from(thisHexString, 'hex');
};

exports.toBigInteger = function(bufferObj) {
    return new BigInteger(bufferObj.toString('hex'), 16);
};

exports.hash=function(type){
    return function(text){
        return createHash(type)
            .update(text)
            .digest()
    }
}





