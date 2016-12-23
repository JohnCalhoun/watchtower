var chai=require('chai')
var expect=chai.expect
var mocha=require('mocha')

describe('routes',function(){  

    before(function(){
        browser.url('/routes/test.html') 
    })

    it('blank',function(){
    })
    
    after(function(){
        //console.log(browser.log('browser'))
    })
})
