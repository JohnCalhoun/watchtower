var init=function(resolve,reject){ 
    this.api_url=document
            .querySelector( 'meta[name="api_url"]' )
            .getAttribute('content')
   
    resolve()
}

var build=function(){
    var intialize=new Promise(init.bind(this))
    this.ready=intialize     
}

module.exports=build
