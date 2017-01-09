(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var init=function(resolve,reject){ 
    this.api_url=document
            .querySelector( 'meta[name="api_url"]' )
            .getAttribute('content')
    
    var counts=document
            .querySelectorAll( 'meta[name^="numberOf"]' )
    for(var i=0;i<counts.length;i++){
        var meta=counts[i]
        this[meta.getAttribute('name')]=parseInt(meta.getAttribute('content'))
    }
    
    this.timing_url=API_TIMING
    resolve()
}

var build=function(){
    var intialize=new Promise(init.bind(this))
    this.ready=intialize     
}

module.exports=build

},{}],2:[function(require,module,exports){
var constants_tmp=require('./constants.js')

var constants=new constants_tmp()
constants.ready.then(function(){
    window.constants_test=constants 

    var new_div=document.createElement('div')
    new_div.setAttribute('id','done')
    document.querySelector('main').appendChild(new_div)
})



},{"./constants.js":1}]},{},[2]);
