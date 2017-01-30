module.exports=function(group,keylength){
    var srp=require('./srp.js')(group,keylength,64)
    var out={}

    out.getSaltVerifier=function(I,P){
        var salt=srp.generateSalt()
        var x=srp.x(I,P,salt)
        return {
            v:srp.v(x),
            salt:salt
        }
    }
    out.genA=function(){
        return srp.A()  
    }
    out.getShared=function(A,B,a,I,P,s){
        var key=srp.clientS(A,B,a,I,P,s)
        return srp.K(key)
    }

    return out
}
