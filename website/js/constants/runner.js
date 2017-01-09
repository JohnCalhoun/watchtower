var chai=require('chai')
var expect=chai.expect
var mocha=require('mocha')


describe('constants',function(){  

    before(function(){
        browser.url('/constants/test.html') 
    })

    it('initialize',function(){

        //browser.waitForExist('#done')
        var constants=browser.execute(function(){
                return(window.constants_test )
            }).value

        expect(constants.api_url).to.equal('should-be-this')
    })
    
    after(function(){
        console.log(browser.log('browser'))
    })
})
