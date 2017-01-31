module.exports=function(group,keylength){
    var srp=require('./srp.js')(group,keylength,64)
    var out={}
   
    out.checkHotp=function(verifier,x){
        return srp.check(verifier,x)
    }
    out.genBandShared=function(A,salt,verifier){
        var Bs=srp.B(verifier)
        var key=srp.serverS(
            A,
            Bs.B,
            Bs.b,
            verifier
        ) 

        return {
            key:srp.K(key.key),
            B:Bs.B,
            b:Bs.b
        }
    }

    return out
}
