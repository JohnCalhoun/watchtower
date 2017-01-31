var BigInteger = require('jsbn').BigInteger;
var util=require('./util.js')
var crypto = require('crypto');
var randomBytes = crypto.randomBytes;
var SRP={}
var hash_type='sha512'

var passwordHash=util.hash(hash_type)
var keyHash=util.hash(hash_type)
var scrambleHash=util.hash(hash_type)
var publicHash=util.hash(hash_type)

module.exports=function(group,keylength,saltLength){
    var dh=require('crypto').getDiffieHellman(group)
    var g=util.toBigInteger(dh.getGenerator())
    var N=util.toBigInteger(dh.getPrime())
    var htop_window=60

    SRP.constants=function(){
        return {
            g:g,
            N:N,
            htop_window:htop_window,
            group:group,
            keylength:keylength,
            saltLength:saltLength,
        }
    }
    SRP.randomInt=function(size) {
        return util.toBigInteger(randomBytes(size))
    };

    SRP.generateSalt=function() {
        return randomBytes(saltLength).toString('hex')
    };

    SRP.x = function(I,P,salt) {
        var identifierPasswordHash = passwordHash(I+':'+P);
        var xHash=passwordHash(salt+identifierPasswordHash);
        
        var stretch = crypto.pbkdf2Sync(xHash, salt, 10000, 512, 'sha512');
        var result = util.toBigInteger(stretch);
        return result;
    };

    SRP.v = function(x) {
        var result = g.modPow(x, N);
        return util.toN(result);
    };

    SRP.A = function() {
        var a=SRP.randomInt(keylength)
        var result = g.modPow(a, N);
        var A=util.toN(result);

        return {
            A:A,
            a:a
        }
    };

    SRP.k = function() {
        result = scrambleHash(N.toString(16)+g.toString(16));
        return util.toBigInteger(result);
    };

    SRP.B = function(v) {
        var b=SRP.randomInt(keylength)
        var k=SRP.k()

        var result = k.multiply(util.toBigInteger(v)).add(g.modPow(b, N)).mod(N);
        var B=util.toN(result);
        return {B:B,b:b}
    };

    SRP.u = function(A,B) {
        return util.toBigInteger(
            publicHash(
                A.toString('hex')+B.toString('hex')
            )
        );
    };

    SRP.clientHotp=function(I,P,s,win=htop_window){
        var x=SRP.x(I,P,s)
        var v_int=g.modPow(x, N)
        var t=Math.floor((new Date()).getTime()/1000/win)
        var hmac=crypto.createHmac('sha512',v_int.toString(16))
        hmac.update(t.toString())
        return hmac.digest('hex')
    }

    SRP.serverHotp=function(v_int,date=(new Date()),offset=0,win=htop_window){
        var t=Math.floor(date.getTime()/1000/win)-offset
        var hmac=crypto.createHmac('sha512',v_int.toString(16))
        hmac.update(t.toString())
        return hmac.digest('hex')
    }

    SRP.check=function(verifier,x){
        var now=new Date()
       
        var check_time=function(offset){
            var mine=SRP.serverHotp(util.toBigInteger(verifier),now,offset) 
            return crypto.timingSafeEqual(
                    Buffer.from(mine,'hex'),
                    Buffer.from(x,'hex')
                )
        }
        return (check_time(0) || check_time(1))
     }

    SRP.clientS = function(A,B,a,I,P,s) {
        var x=SRP.x(I,P,s)
        var k=SRP.k()
        var u=SRP.u(A,B)
        var B_int=util.toBigInteger(B)
        var v_int=g.modPow(x, N)
        
        var result = B_int.subtract(k.multiply(v_int)).modPow(a.add(u.multiply(x)), N);
        var key=util.toN(result);

        return {key:key} 
    };

    SRP.serverS = function(A,B,b,v) {
        if(!util.toBigInteger(B).mod(N).equals(BigInteger.ZERO)){
            var v_int=util.toBigInteger(v)

            var A_int=util.toBigInteger(A)
            var u_int=SRP.u(A,B)
 
            var result = A_int.multiply(v_int.modPow(u_int, N)).modPow(b, N);
            var key=util.toN(result);

            return {key:key} 
        }else{
            return false
        }
    };

    SRP.K=function(key){
        return keyHash(key.toString('hex')).toString('hex')
    }
    SRP.debug=function(A,B,a,b,I,P,s){
        var u=SRP.u(A,B)
        var x=SRP.x(I,P,s)

        return SRP.K(util.toN(g.modPow(b,N).modPow(a.add(u.multiply(x)),N)))
    }
    return SRP
}


