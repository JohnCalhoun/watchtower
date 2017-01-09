var pathToRegex=require('path-to-regexp')

var routes=function(){
    var _current=''
    var _routes=[]

    this.register=function(path,fn){
        var reg=pathToRegex(path,[])
        _routes.push(
            {   regex:reg,
                func:fn}
            )
    }
     
    this.dispatch=function(path){
        for(var i=0; i<_routes.length;i++){
            var route=_routes[i] 
            var match=route.regex.exec(path)
            if(match){
                route.func.apply(this,match.splice(1))
            }
        }
    }.bind(this) 
    this.redirect=this.dispatch
    
    this.check_hash=function(){
        if( window.location.hash !=_current){
            this.dispatch(window.location.hash.substring(1))
            _current=window.location.hash
        }
    }.bind(this)
    
    window.addEventListener('popstate',this.check_hash) 
    this.onHashChange=this.check_hash
}

module.exports=routes
