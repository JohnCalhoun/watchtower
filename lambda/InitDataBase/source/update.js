var create=require('./create.js')
var del=require('./delete.js')

module.exports=function(ID,newParams,Oldparams,reply){
    del(ID,{},function(){
        create(newParams,reply)
    })
}







