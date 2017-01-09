var routes_mod=require('./routes.js')
var routes=new routes_mod()

routes.register('/:foo',function(bar){
        var new_div=document.createElement('div')
        new_div.setAttribute('id','target')
        document.querySelector('main').appendChild(new_div)
    })

window.addEventListener('popstate',routes.onHashChange)

document.addEventListener('DOMContentLoaded',
    function(){
        routes.check_hash()
        document.querySelector('.link-button')
            .addEventListener('click',function(e){
                history.pushState(null,null,'#'+e.target.getAttribute('data-href'))
                routes.check_hash()
            })
    }
    )
