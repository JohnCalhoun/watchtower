var BigInteger = require('jsbn').BigInteger;
var crypto=require('crypto')

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

exports.isZero=function(bi){
    return bi.equals(BigInteger.ZERO)
}

exports.wraps=function(a,g,n){
    return g.pow(a).compareTo(n) > 0
}

    
exports.hash=function(type){
    return function(text){
        return crypto.createHash(type)
            .update(text)
            .digest()
    }
}





