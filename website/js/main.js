document.addEventListener('DOMContentLoaded',function(){
    var constants_mod=require('./constants/constants.js')
    var constants=new constants_mod()

    constants.ready.then(function(){
        var routes_con=require('./routes/routes.js')
        var routes=new routes_con() 
        constants.routes=routes

        document.querySelector('nav')
            .addEventListener('click',function(e){
                if(e.target.nodeName === 'A'){
                    var siblings=e.target.parentNode.parentNode.children
                    for(var i=0;i<siblings.length;i++){
                        siblings[i].classList.remove('active') 
                    }
                    e.target.parentNode.classList.add('active')
                }
            })

        document.addEventListener('click',function(e){
            if(e.target.nodeName==='.link-button'){
                e.stopPropagation()
                e.preventDefault()
                history.pushState(null,null,'#'+e.target.getAttribute('href'))
                routes.onHashChange()
            }
        })
    })
})
