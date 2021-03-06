var BigInteger = require('jsbn').BigInteger;
var util=require('./util.js')
var crypto = require('crypto');
var randomBytes = crypto.randomBytes;
var SRP={}
var Promise=require('bluebird')
var argon2=require('argon2')

var hash_type='sha512'
var passwordHash=util.hash(hash_type)
var keyHash=util.hash(hash_type)
var scrambleHash=util.hash(hash_type)
var publicHash=util.hash(hash_type)

module.exports=function(group,keylength=64,saltLength=64,htop_window=60){
    var dh=require('crypto').getDiffieHellman(group)
    var g=util.toBigInteger(dh.getGenerator())
    var N=util.toBigInteger(dh.getPrime())

    var argonParams={
        timeCost: 4, 
        memoryCost: 15, 
        parallelism: 2, 
        type: argon2.argon2d,
        raw:true,
        hashLength:64}

    var wraps=function(a){
        return util.wraps(a,g,N)
    }

    SRP.constants=function(){
        return {
            g:g,
            N:N,
            htop_window:htop_window,
            group:group,
            argon:argonParams
        }
    }
    SRP.randomInt=function(size) {
        return util.toBigInteger(randomBytes(size))
    };

    SRP.generateSalt=function() {
        return randomBytes(keylength).toString('hex')
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
        var a,A,tmp
        
        var make=function(t){ 
            if(t<=0) throw "Failed to Generate A"

            a=SRP.randomInt(keylength)
            tmp = g.modPow(a, N);
            return !util.isZero(tmp) || wraps(a) ? tmp : make(--t) 
        }

        A=util.toN(make(10));
        
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
        var b,B,tmp
        var k=SRP.k()
        
        var make=function(t){ 
            if(t<=0) throw "Failed to Generate B"

            b=SRP.randomInt(keylength)
            tmp = k.multiply(util.toBigInteger(v)).add(g.modPow(b, N)).mod(N);
            return !util.isZero(tmp) || wraps(b) ? tmp : make(--t) 
        }

        var B=util.toN(make(10));
        return {B:B,b:b}
    };

    SRP.u = function(A,B) {
        var tmp=util.toBigInteger(
            publicHash(
                A.toString('hex')+B.toString('hex')
            )
        );
        if(util.isZero(tmp)) throw "Invalid u"
        return tmp
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

    var PublicCheck=function(A){
        var A_int=util.toBigInteger(A)
        if(util.isZero(A_int)) throw "Invalid A"
        if(A_int.mod(N).equals(BigInteger.ZERO))   throw "Invalid A"
    }

    SRP.clientS = function(A,B,a,I,P,s) {
        PublicCheck(A)
        PublicCheck(B)

        var B_int=util.toBigInteger(B)
       
        var x=SRP.x(I,P,s)
        var k=SRP.k()
        var u=SRP.u(A,B)

        var v_int=g.modPow(x, N)
        
        var result = B_int.subtract(k.multiply(v_int)).modPow(a.add(u.multiply(x)), N);
        var key=util.toN(result);

        return {key:key} 
    };

    SRP.serverS = function(A,B,b,v) {
        PublicCheck(A)
        PublicCheck(B)

        var A_int=util.toBigInteger(A)

        var v_int=util.toBigInteger(v)
        var u_int=SRP.u(A,B)

        var result = A_int.multiply(v_int.modPow(u_int, N)).modPow(b, N);
        var key=util.toN(result);

        return {key:key} 
    };

    SRP.K=function(key,salt){
        return argon2.hash(key.toString('hex'),Buffer.from(salt),argonParams)
        .then(function(hash){
            return hash.toString('hex')
        })
    }
    SRP.debug=function(A,B,a,b,I,P,s){
        var u=SRP.u(A,B)
        var x=SRP.x(I,P,s)

        return SRP.K(util.toN(g.modPow(b,N).modPow(a.add(u.multiply(x)),N)),s)
    }
    return SRP
}


