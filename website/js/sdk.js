var apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{},apiGateway.core.apiGatewayClientFactory={},apiGateway.core.apiGatewayClientFactory.newClient=function(a,b){var c={},d=apiGateway.core.sigV4ClientFactory.newClient(b),e=apiGateway.core.simpleHttpClientFactory.newClient(a);return c.makeRequest=function(a,b,c,f){var g=e;return void 0!==f&&""!==f&&null!==f&&(a.headers["x-api-key"]=f),void 0!==a.body&&""!==a.body&&null!==a.body&&0!==Object.keys(a.body).length||(a.body=void 0),a.headers=apiGateway.core.utils.mergeInto(a.headers,c.headers),a.queryParams=apiGateway.core.utils.mergeInto(a.queryParams,c.queryParams),"AWS_IAM"===b&&(g=d),g.makeRequest(a)},c};var apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{},apiGateway.core.sigV4ClientFactory={},apiGateway.core.sigV4ClientFactory.newClient=function(a){function b(a){return CryptoJS.SHA256(a)}function c(a){return a.toString(CryptoJS.enc.Hex)}function d(a,b){return CryptoJS.HmacSHA256(b,a,{asBytes:!0})}function e(a,d,e,f,k){return a+"\n"+g(d)+"\n"+h(e)+"\n"+i(f)+"\n"+j(f)+"\n"+c(b(k))}function f(a){return c(b(a))}function g(a){return encodeURI(a)}function h(a){if(Object.keys(a).length<1)return"";var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);b.sort();for(var d="",e=0;e<b.length;e++)d+=b[e]+"="+encodeURIComponent(a[b[e]])+"&";return d.substr(0,d.length-1)}function i(a){var b="",c=[];for(var d in a)a.hasOwnProperty(d)&&c.push(d);c.sort();for(var e=0;e<c.length;e++)b+=c[e].toLowerCase()+":"+a[c[e]]+"\n";return b}function j(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c.toLowerCase());return b.sort(),b.join(";")}function k(a,b,c){return p+"\n"+a+"\n"+b+"\n"+c}function l(a,b,c){return a.substr(0,8)+"/"+b+"/"+c+"/"+q}function m(a,b,c,e){return d(d(d(d(r+a,b.substr(0,8)),c),e),q)}function n(a,b){return c(d(a,b))}function o(a,b,c,d){return p+" Credential="+a+"/"+b+", SignedHeaders="+j(c)+", Signature="+d}var p="AWS4-HMAC-SHA256",q="aws4_request",r="AWS4",s="x-amz-date",t="x-amz-security-token",u="host",v="Authorization",w={};return void 0===a.accessKey||void 0===a.secretKey?w:(w.accessKey=apiGateway.core.utils.assertDefined(a.accessKey,"accessKey"),w.secretKey=apiGateway.core.utils.assertDefined(a.secretKey,"secretKey"),w.sessionToken=a.sessionToken,w.serviceName=apiGateway.core.utils.assertDefined(a.serviceName,"serviceName"),w.region=apiGateway.core.utils.assertDefined(a.region,"region"),w.endpoint=apiGateway.core.utils.assertDefined(a.endpoint,"endpoint"),w.makeRequest=function(b){var c=apiGateway.core.utils.assertDefined(b.verb,"verb"),d=apiGateway.core.utils.assertDefined(b.path,"path"),g=apiGateway.core.utils.copy(b.queryParams);void 0===g&&(g={});var i=apiGateway.core.utils.copy(b.headers);void 0===i&&(i={}),void 0===i["Content-Type"]&&(i["Content-Type"]=a.defaultContentType),void 0===i.Accept&&(i.Accept=a.defaultAcceptType);var j=apiGateway.core.utils.copy(b.body);j=void 0===j||"GET"===c?"":JSON.stringify(j),""!==j&&void 0!==j&&null!==j||delete i["Content-Type"];var p=(new Date).toISOString().replace(/\.\d{3}Z$/,"Z").replace(/[:\-]|\.\d{3}/g,"");i[s]=p;var q=document.createElement("a");q.href=w.endpoint,i[u]=q.hostname;var r=e(c,d,g,i,j),x=f(r),y=l(p,w.region,w.serviceName),z=k(p,y,x),A=m(w.secretKey,p,w.region,w.serviceName),B=n(A,z);i[v]=o(w.accessKey,y,i,B),void 0!==w.sessionToken&&""!==w.sessionToken&&(i[t]=w.sessionToken),delete i[u];var C=a.endpoint+d,D=h(g);""!=D&&(C+="?"+D),void 0===i["Content-Type"]&&(i["Content-Type"]=a.defaultContentType);var E={method:c,url:C,headers:i,data:j};return axios(E)},w)};var apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{},apiGateway.core.simpleHttpClientFactory={},apiGateway.core.simpleHttpClientFactory.newClient=function(a){function b(a){if(Object.keys(a).length<1)return"";var b="";for(var c in a)a.hasOwnProperty(c)&&(b+=encodeURIComponent(c)+"="+encodeURIComponent(a[c])+"&");return b.substr(0,b.length-1)}var c={};return c.endpoint=apiGateway.core.utils.assertDefined(a.endpoint,"endpoint"),c.makeRequest=function(c){var d=apiGateway.core.utils.assertDefined(c.verb,"verb"),e=apiGateway.core.utils.assertDefined(c.path,"path"),f=apiGateway.core.utils.copy(c.queryParams);void 0===f&&(f={});var g=apiGateway.core.utils.copy(c.headers);void 0===g&&(g={}),void 0===g["Content-Type"]&&(g["Content-Type"]=a.defaultContentType),void 0===g.Accept&&(g.Accept=a.defaultAcceptType);var h=apiGateway.core.utils.copy(c.body);void 0===h&&(h="");var i=a.endpoint+e,j=b(f);""!=j&&(i+="?"+j);var k={method:d,url:i,headers:g,data:h};return axios(k)},c};var apiGateway=apiGateway||{};apiGateway.core=apiGateway.core||{},apiGateway.core.utils={assertDefined:function(a,b){if(void 0===a)throw b+" must be defined";return a},assertParametersDefined:function(a,b,c){if(void 0!==b){b.length>0&&void 0===a&&(a={});for(var d=0;d<b.length;d++)apiGateway.core.utils.contains(c,b[d])||apiGateway.core.utils.assertDefined(a[b[d]],b[d])}},parseParametersToObject:function(a,b){if(void 0===a)return{};for(var c={},d=0;d<b.length;d++)c[b[d]]=a[b[d]];return c},contains:function(a,b){if(void 0===a)return!1;for(var c=a.length;c--;)if(a[c]===b)return!0;return!1},copy:function(a){if(null==a||"object"!=typeof a)return a;var b=a.constructor();for(var c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b},mergeInto:function(a,b){if(null==a||"object"!=typeof a)return a;var c=a.constructor();for(var d in a)a.hasOwnProperty(d)&&(c[d]=a[d]);if(null==b||"object"!=typeof b)return a;for(d in b)b.hasOwnProperty(d)&&(c[d]=b[d]);return c}},function(a,b){"object"==typeof exports&&"object"==typeof module?module.exports=b():"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?exports.axios=b():a.axios=b()}(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){a.exports=c(1)},function(a,b,c){"use strict";var d=c(2),e=c(3),f=c(4),g=c(12),h=a.exports=function(a){"string"==typeof a&&(a=e.merge({url:arguments[0]},arguments[1])),a=e.merge({method:"get",headers:{},timeout:d.timeout,transformRequest:d.transformRequest,transformResponse:d.transformResponse},a),a.withCredentials=a.withCredentials||d.withCredentials;var b=[f,void 0],c=Promise.resolve(a);for(h.interceptors.request.forEach(function(a){b.unshift(a.fulfilled,a.rejected)}),h.interceptors.response.forEach(function(a){b.push(a.fulfilled,a.rejected)});b.length;)c=c.then(b.shift(),b.shift());return c};h.defaults=d,h.all=function(a){return Promise.all(a)},h.spread=c(13),h.interceptors={request:new g,response:new g},function(){function a(){e.forEach(arguments,function(a){h[a]=function(b,c){return h(e.merge(c||{},{method:a,url:b}))}})}function b(){e.forEach(arguments,function(a){h[a]=function(b,c,d){return h(e.merge(d||{},{method:a,url:b,data:c}))}})}a("delete","get","head"),b("post","put","patch")}()},function(a,b,c){"use strict";var d=c(3),e=/^\)\]\}',?\n/,f={"Content-Type":"application/json"};a.exports={transformRequest:[function(a,b){return d.isFormData(a)?a:d.isArrayBuffer(a)?a:d.isArrayBufferView(a)?a.buffer:!d.isObject(a)||d.isFile(a)||d.isBlob(a)?a:(d.isUndefined(b)||(d.forEach(b,function(a,c){"content-type"===c.toLowerCase()&&(b["Content-Type"]=a)}),d.isUndefined(b["Content-Type"])&&(b["Content-Type"]="application/json;charset=utf-8")),JSON.stringify(a))}],transformResponse:[function(a){if("string"==typeof a){a=a.replace(e,"");try{a=JSON.parse(a)}catch(a){}}return a}],headers:{common:{Accept:"application/json, text/plain, */*"},patch:d.merge(f),post:d.merge(f),put:d.merge(f)},timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"}},function(a,b){"use strict";function c(a){return"[object Array]"===s.call(a)}function d(a){return"[object ArrayBuffer]"===s.call(a)}function e(a){return"[object FormData]"===s.call(a)}function f(a){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(a):a&&a.buffer&&a.buffer instanceof ArrayBuffer}function g(a){return"string"==typeof a}function h(a){return"number"==typeof a}function i(a){return"undefined"==typeof a}function j(a){return null!==a&&"object"==typeof a}function k(a){return"[object Date]"===s.call(a)}function l(a){return"[object File]"===s.call(a)}function m(a){return"[object Blob]"===s.call(a)}function n(a){return a.replace(/^\s*/,"").replace(/\s*$/,"")}function o(a){return"[object Arguments]"===s.call(a)}function p(){return"undefined"!=typeof window&&"undefined"!=typeof document&&"function"==typeof document.createElement}function q(a,b){if(null!==a&&"undefined"!=typeof a){var d=c(a)||o(a);if("object"==typeof a||d||(a=[a]),d)for(var e=0,f=a.length;e<f;e++)b.call(null,a[e],e,a);else for(var g in a)a.hasOwnProperty(g)&&b.call(null,a[g],g,a)}}function r(){var a={};return q(arguments,function(b){q(b,function(b,c){a[c]=b})}),a}var s=Object.prototype.toString;a.exports={isArray:c,isArrayBuffer:d,isFormData:e,isArrayBufferView:f,isString:g,isNumber:h,isObject:j,isUndefined:i,isDate:k,isFile:l,isBlob:m,isStandardBrowserEnv:p,forEach:q,merge:r,trim:n}},function(a,b,c){(function(b){"use strict";a.exports=function(a){return new Promise(function(d,e){try{"undefined"!=typeof XMLHttpRequest||"undefined"!=typeof ActiveXObject?c(6)(d,e,a):"undefined"!=typeof b&&c(6)(d,e,a)}catch(a){e(a)}})}}).call(b,c(5))},function(a,b){function c(){j=!1,g.length?i=g.concat(i):k=-1,i.length&&d()}function d(){if(!j){var a=setTimeout(c);j=!0;for(var b=i.length;b;){for(g=i,i=[];++k<b;)g&&g[k].run();k=-1,b=i.length}g=null,j=!1,clearTimeout(a)}}function e(a,b){this.fun=a,this.array=b}function f(){}var g,h=a.exports={},i=[],j=!1,k=-1;h.nextTick=function(a){var b=new Array(arguments.length-1);if(arguments.length>1)for(var c=1;c<arguments.length;c++)b[c-1]=arguments[c];i.push(new e(a,b)),1!==i.length||j||setTimeout(d,0)},e.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=f,h.addListener=f,h.once=f,h.off=f,h.removeListener=f,h.removeAllListeners=f,h.emit=f,h.binding=function(a){throw new Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(a){throw new Error("process.chdir is not supported")},h.umask=function(){return 0}},function(a,b,c){"use strict";var d=c(2),e=c(3),f=c(7),g=c(8),h=c(9);a.exports=function(a,b,i){var j=h(i.data,i.headers,i.transformRequest),k=e.merge(d.headers.common,d.headers[i.method]||{},i.headers||{});e.isFormData(j);var l=new(XMLHttpRequest||ActiveXObject)("Microsoft.XMLHTTP");if(l.open(i.method.toUpperCase(),f(i.url,i.params),!0),l.timeout=i.timeout,l.onreadystatechange=function(){if(l&&4===l.readyState){var c=g(l.getAllResponseHeaders()),d=["text",""].indexOf(i.responseType||"")!==-1?l.responseText:l.response,e={data:h(d,c,i.transformResponse),status:l.status,statusText:l.statusText,headers:c,config:i};(l.status>=200&&l.status<300?a:b)(e),l=null}},e.isStandardBrowserEnv()){var m=c(10),n=c(11),o=n(i.url)?m.read(i.xsrfCookieName||d.xsrfCookieName):void 0;o&&(k[i.xsrfHeaderName||d.xsrfHeaderName]=o)}if(e.forEach(k,function(a,b){j||"content-type"!==b.toLowerCase()?l.setRequestHeader(b,a):delete k[b]}),i.withCredentials&&(l.withCredentials=!0),i.responseType)try{l.responseType=i.responseType}catch(a){if("json"!==l.responseType)throw a}e.isArrayBuffer(j)&&(j=new DataView(j)),l.send(j)}},function(a,b,c){"use strict";function d(a){return encodeURIComponent(a).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var e=c(3);a.exports=function(a,b){if(!b)return a;var c=[];return e.forEach(b,function(a,b){null!==a&&"undefined"!=typeof a&&(e.isArray(a)&&(b+="[]"),e.isArray(a)||(a=[a]),e.forEach(a,function(a){e.isDate(a)?a=a.toISOString():e.isObject(a)&&(a=JSON.stringify(a)),c.push(d(b)+"="+d(a))}))}),c.length>0&&(a+=(a.indexOf("?")===-1?"?":"&")+c.join("&")),a}},function(a,b,c){"use strict";var d=c(3);a.exports=function(a){var b,c,e,f={};return a?(d.forEach(a.split("\n"),function(a){e=a.indexOf(":"),b=d.trim(a.substr(0,e)).toLowerCase(),c=d.trim(a.substr(e+1)),b&&(f[b]=f[b]?f[b]+", "+c:c)}),f):f}},function(a,b,c){"use strict";var d=c(3);a.exports=function(a,b,c){return d.forEach(c,function(c){a=c(a,b)}),a}},function(a,b,c){"use strict";var d=c(3);a.exports={write:function(a,b,c,e,f,g){var h=[];h.push(a+"="+encodeURIComponent(b)),d.isNumber(c)&&h.push("expires="+new Date(c).toGMTString()),d.isString(e)&&h.push("path="+e),d.isString(f)&&h.push("domain="+f),g===!0&&h.push("secure"),document.cookie=h.join("; ")},read:function(a){var b=document.cookie.match(new RegExp("(^|;\\s*)("+a+")=([^;]*)"));return b?decodeURIComponent(b[3]):null},remove:function(a){this.write(a,"",Date.now()-864e5)}}},function(a,b,c){"use strict";function d(a){var b=a;return g&&(h.setAttribute("href",b),b=h.href),h.setAttribute("href",b),{href:h.href,protocol:h.protocol?h.protocol.replace(/:$/,""):"",host:h.host,search:h.search?h.search.replace(/^\?/,""):"",hash:h.hash?h.hash.replace(/^#/,""):"",hostname:h.hostname,port:h.port,pathname:"/"===h.pathname.charAt(0)?h.pathname:"/"+h.pathname}}var e,f=c(3),g=/(msie|trident)/i.test(navigator.userAgent),h=document.createElement("a");e=d(window.location.href),a.exports=function(a){var b=f.isString(a)?d(a):a;return b.protocol===e.protocol&&b.host===e.host}},function(a,b,c){"use strict";function d(){this.handlers=[]}var e=c(3);d.prototype.use=function(a,b){return this.handlers.push({fulfilled:a,rejected:b}),this.handlers.length-1},d.prototype.eject=function(a){this.handlers[a]&&(this.handlers[a]=null)},d.prototype.forEach=function(a){e.forEach(this.handlers,function(b){null!==b&&a(b)})},a.exports=d},function(a,b){"use strict";a.exports=function(a){return function(b){return a.apply(null,b)}}}])}),function(){var a=CryptoJS,b=a.lib,c=b.WordArray,d=a.enc;d.Base64={stringify:function(a){var b=a.words,c=a.sigBytes,d=this._map;a.clamp();for(var e=[],f=0;f<c;f+=3)for(var g=b[f>>>2]>>>24-f%4*8&255,h=b[f+1>>>2]>>>24-(f+1)%4*8&255,i=b[f+2>>>2]>>>24-(f+2)%4*8&255,j=g<<16|h<<8|i,k=0;k<4&&f+.75*k<c;k++)e.push(d.charAt(j>>>6*(3-k)&63));var l=d.charAt(64);if(l)for(;e.length%4;)e.push(l);return e.join("")},parse:function(a){var b=a.length,d=this._map,e=d.charAt(64);if(e){var f=a.indexOf(e);f!=-1&&(b=f)}for(var g=[],h=0,i=0;i<b;i++)if(i%4){var j=d.indexOf(a.charAt(i-1))<<i%4*2,k=d.indexOf(a.charAt(i))>>>6-i%4*2;g[h>>>2]|=(j|k)<<24-h%4*8,h++}return c.create(g,h)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(){var a=CryptoJS,b=a.lib,c=b.Base,d=a.enc,e=d.Utf8,f=a.algo;f.HMAC=c.extend({init:function(a,b){a=this._hasher=new a.init,"string"==typeof b&&(b=e.parse(b));var c=a.blockSize,d=4*c;b.sigBytes>d&&(b=a.finalize(b)),b.clamp();for(var f=this._oKey=b.clone(),g=this._iKey=b.clone(),h=f.words,i=g.words,j=0;j<c;j++)h[j]^=1549556828,i[j]^=909522486;f.sigBytes=g.sigBytes=d,this.reset()},reset:function(){var a=this._hasher;a.reset(),a.update(this._iKey)},update:function(a){return this._hasher.update(a),this},finalize:function(a){var b=this._hasher,c=b.finalize(a);b.reset();var d=b.finalize(this._oKey.clone().concat(c));return d}})}();var CryptoJS=CryptoJS||function(a,b){var c={},d=c.lib={},e=function(){},f=d.Base={extend:function(a){e.prototype=this;var b=new e;return a&&b.mixIn(a),b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)}),b.init.prototype=b,b.$super=this,b},create:function(){var a=this.extend();return a.init.apply(a,arguments),a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},g=d.WordArray=f.extend({init:function(a,c){a=this.words=a||[],this.sigBytes=c!=b?c:4*a.length},toString:function(a){return(a||i).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes;if(a=a.sigBytes,this.clamp(),d%4)for(var e=0;e<a;e++)b[d+e>>>2]|=(c[e>>>2]>>>24-8*(e%4)&255)<<24-8*((d+e)%4);else if(65535<c.length)for(e=0;e<a;e+=4)b[d+e>>>2]=c[e>>>2];else b.push.apply(b,c);return this.sigBytes+=a,this},clamp:function(){var b=this.words,c=this.sigBytes;b[c>>>2]&=4294967295<<32-8*(c%4),b.length=a.ceil(c/4)},clone:function(){var a=f.clone.call(this);return a.words=this.words.slice(0),a},random:function(b){for(var c=[],d=0;d<b;d+=4)c.push(4294967296*a.random()|0);return new g.init(c,b)}}),h=c.enc={},i=h.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],d=0;d<a;d++){var e=b[d>>>2]>>>24-8*(d%4)&255;c.push((e>>>4).toString(16)),c.push((15&e).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return new g.init(c,b/2)}},j=h.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(255&a.charCodeAt(d))<<24-8*(d%4);return new g.init(c,b)}},k=h.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(a){throw Error("Malformed UTF-8 data")}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},l=d.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new g.init,this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a)),this._data.concat(a),this._nDataBytes+=a.sigBytes},_process:function(b){var c=this._data,d=c.words,e=c.sigBytes,f=this.blockSize,h=e/(4*f),h=b?a.ceil(h):a.max((0|h)-this._minBufferSize,0);if(b=h*f,e=a.min(4*b,e),b){for(var i=0;i<b;i+=f)this._doProcessBlock(d,i);i=d.splice(0,b),c.sigBytes-=e}return new g.init(i,e)},clone:function(){var a=f.clone.call(this);return a._data=this._data.clone(),a},_minBufferSize:0});d.Hasher=l.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a),this.reset()},reset:function(){l.reset.call(this),this._doReset()},update:function(a){return this._append(a),this._process(),this},finalize:function(a){return a&&this._append(a),this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return new a.init(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return new m.HMAC.init(a,c).finalize(b)}}});var m=c.algo={};return c}(Math);!function(a){for(var b=CryptoJS,c=b.lib,d=c.WordArray,e=c.Hasher,c=b.algo,f=[],g=[],h=function(a){return 4294967296*(a-(0|a))|0},i=2,j=0;64>j;){var k;a:{k=i;for(var l=a.sqrt(k),m=2;m<=l;m++)if(!(k%m)){k=!1;break a}k=!0}k&&(8>j&&(f[j]=h(a.pow(i,.5))),g[j]=h(a.pow(i,1/3)),j++),i++}var n=[],c=c.SHA256=e.extend({_doReset:function(){this._hash=new d.init(f.slice(0))},_doProcessBlock:function(a,b){for(var c=this._hash.words,d=c[0],e=c[1],f=c[2],h=c[3],i=c[4],j=c[5],k=c[6],l=c[7],m=0;64>m;m++){if(16>m)n[m]=0|a[b+m];else{var o=n[m-15],p=n[m-2];n[m]=((o<<25|o>>>7)^(o<<14|o>>>18)^o>>>3)+n[m-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+n[m-16]}o=l+((i<<26|i>>>6)^(i<<21|i>>>11)^(i<<7|i>>>25))+(i&j^~i&k)+g[m]+n[m],p=((d<<30|d>>>2)^(d<<19|d>>>13)^(d<<10|d>>>22))+(d&e^d&f^e&f),l=k,k=j,j=i,i=h+o|0,h=f,f=e,e=d,d=o+p|0}c[0]=c[0]+d|0,c[1]=c[1]+e|0,c[2]=c[2]+f|0,c[3]=c[3]+h|0,c[4]=c[4]+i|0,c[5]=c[5]+j|0,c[6]=c[6]+k|0,c[7]=c[7]+l|0},_doFinalize:function(){var b=this._data,c=b.words,d=8*this._nDataBytes,e=8*b.sigBytes;return c[e>>>5]|=128<<24-e%32,c[(e+64>>>9<<4)+14]=a.floor(d/4294967296),c[(e+64>>>9<<4)+15]=d,b.sigBytes=4*c.length,this._process(),this._hash},clone:function(){var a=e.clone.call(this);return a._hash=this._hash.clone(),a}});b.SHA256=e._createHelper(c),b.HmacSHA256=e._createHmacHelper(c)}(Math),function(){var a=CryptoJS,b=a.enc.Utf8;a.algo.HMAC=a.lib.Base.extend({init:function(a,c){a=this._hasher=new a.init,"string"==typeof c&&(c=b.parse(c));var d=a.blockSize,e=4*d;c.sigBytes>e&&(c=a.finalize(c)),c.clamp();for(var f=this._oKey=c.clone(),g=this._iKey=c.clone(),h=f.words,i=g.words,j=0;j<d;j++)h[j]^=1549556828,i[j]^=909522486;f.sigBytes=g.sigBytes=e,this.reset()},reset:function(){var a=this._hasher;a.reset(),a.update(this._iKey)},update:function(a){return this._hasher.update(a),this},finalize:function(a){var b=this._hasher;return a=b.finalize(a),b.reset(),b.finalize(this._oKey.clone().concat(a))}})}();var CryptoJS=CryptoJS||function(a,b){var c={},d=c.lib={},e=function(){},f=d.Base={extend:function(a){e.prototype=this;var b=new e;return a&&b.mixIn(a),b.hasOwnProperty("init")||(b.init=function(){b.$super.init.apply(this,arguments)}),b.init.prototype=b,b.$super=this,b},create:function(){var a=this.extend();return a.init.apply(a,arguments),a},init:function(){},mixIn:function(a){for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},g=d.WordArray=f.extend({init:function(a,c){a=this.words=a||[],this.sigBytes=c!=b?c:4*a.length},toString:function(a){return(a||i).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes;if(a=a.sigBytes,this.clamp(),d%4)for(var e=0;e<a;e++)b[d+e>>>2]|=(c[e>>>2]>>>24-8*(e%4)&255)<<24-8*((d+e)%4);else if(65535<c.length)for(e=0;e<a;e+=4)b[d+e>>>2]=c[e>>>2];else b.push.apply(b,c);return this.sigBytes+=a,this},clamp:function(){var b=this.words,c=this.sigBytes;b[c>>>2]&=4294967295<<32-8*(c%4),b.length=a.ceil(c/4)},clone:function(){var a=f.clone.call(this);return a.words=this.words.slice(0),a},random:function(b){for(var c=[],d=0;d<b;d+=4)c.push(4294967296*a.random()|0);return new g.init(c,b)}}),h=c.enc={},i=h.Hex={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],d=0;d<a;d++){var e=b[d>>>2]>>>24-8*(d%4)&255;c.push((e>>>4).toString(16)),c.push((15&e).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return new g.init(c,b/2)}},j=h.Latin1={stringify:function(a){var b=a.words;a=a.sigBytes;for(var c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(255&a.charCodeAt(d))<<24-8*(d%4);return new g.init(c,b)}},k=h.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(a){throw Error("Malformed UTF-8 data")}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},l=d.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new g.init,this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=k.parse(a)),this._data.concat(a),this._nDataBytes+=a.sigBytes},_process:function(b){var c=this._data,d=c.words,e=c.sigBytes,f=this.blockSize,h=e/(4*f),h=b?a.ceil(h):a.max((0|h)-this._minBufferSize,0);if(b=h*f,e=a.min(4*b,e),b){for(var i=0;i<b;i+=f)this._doProcessBlock(d,i);i=d.splice(0,b),c.sigBytes-=e}return new g.init(i,e)},clone:function(){var a=f.clone.call(this);return a._data=this._data.clone(),a},_minBufferSize:0});d.Hasher=l.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a),this.reset()},reset:function(){l.reset.call(this),this._doReset()},update:function(a){return this._append(a),this._process(),this},finalize:function(a){return a&&this._append(a),this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,c){return new a.init(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return new m.HMAC.init(a,c).finalize(b)}}});var m=c.algo={};return c}(Math);!function(a){for(var b=CryptoJS,c=b.lib,d=c.WordArray,e=c.Hasher,c=b.algo,f=[],g=[],h=function(a){return 4294967296*(a-(0|a))|0},i=2,j=0;64>j;){var k;a:{k=i;for(var l=a.sqrt(k),m=2;m<=l;m++)if(!(k%m)){k=!1;break a}k=!0}k&&(8>j&&(f[j]=h(a.pow(i,.5))),g[j]=h(a.pow(i,1/3)),j++),i++}var n=[],c=c.SHA256=e.extend({_doReset:function(){this._hash=new d.init(f.slice(0))},_doProcessBlock:function(a,b){for(var c=this._hash.words,d=c[0],e=c[1],f=c[2],h=c[3],i=c[4],j=c[5],k=c[6],l=c[7],m=0;64>m;m++){if(16>m)n[m]=0|a[b+m];else{var o=n[m-15],p=n[m-2];n[m]=((o<<25|o>>>7)^(o<<14|o>>>18)^o>>>3)+n[m-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+n[m-16]}o=l+((i<<26|i>>>6)^(i<<21|i>>>11)^(i<<7|i>>>25))+(i&j^~i&k)+g[m]+n[m],p=((d<<30|d>>>2)^(d<<19|d>>>13)^(d<<10|d>>>22))+(d&e^d&f^e&f),l=k,k=j,j=i,i=h+o|0,h=f,f=e,e=d,d=o+p|0}c[0]=c[0]+d|0,c[1]=c[1]+e|0,c[2]=c[2]+f|0,c[3]=c[3]+h|0,c[4]=c[4]+i|0,c[5]=c[5]+j|0,c[6]=c[6]+k|0,c[7]=c[7]+l|0},_doFinalize:function(){var b=this._data,c=b.words,d=8*this._nDataBytes,e=8*b.sigBytes;return c[e>>>5]|=128<<24-e%32,c[(e+64>>>9<<4)+14]=a.floor(d/4294967296),c[(e+64>>>9<<4)+15]=d,b.sigBytes=4*c.length,this._process(),this._hash},clone:function(){var a=e.clone.call(this);return a._hash=this._hash.clone(),a}});b.SHA256=e._createHelper(c),b.HmacSHA256=e._createHmacHelper(c)}(Math);var uritemplate=function(){function a(a){return"function"==typeof a}function b(a){for(var b in a)return!1;return!0}function c(a,b){for(var c in b)a[c]=b[c];return a}function d(a){this.raw=a,this.cache={}}function e(a){this.set=a}function f(a){this.txt=a}function g(a){return encodeURIComponent(a).replace(t,function(a){return escape(a)})}function h(a){return encodeURI(a)}function i(a,b,c){return b+(b.length>0?"=":"")+c}function j(a,b,c,d){return d=d||!1,d&&(a=""),b&&0!==b.length||(b=a),b+(b.length>0?"=":"")+c}function k(a,b,c,d){return d=d||!1,d&&(a=""),b&&0!==b.length||(b=a),b+(b.length>0&&c?"=":"")+c}function l(a,b){c(this,a),this.vars=b}function m(a){this.str="",a===C?this.appender=m.UnboundAppend:(this.len=0,this.limit=a,this.appender=m.BoundAppend)}function n(a,b,c){var d=new m(c),e="",f=0,g=a.length;for(f=0;f<g;f++)null!==a[f]&&void 0!==a[f]&&(d.append(e).append(a[f],b),e=",");return d.str}function o(a,b,c){var d,e=new m(c),f="";for(d in a)a.hasOwnProperty(d)&&null!==a[d]&&void 0!==a[d]&&(e.append(f+d+",").append(a[d],b),f=",");return e.str}function p(a,b,c,d,e){var f;if(c.isArr)f=n(b,d,a.maxLength);else if(c.isObj)f=o(b,d,a.maxLength);else{var g=new m(a.maxLength);f=g.append(b,d).str}e("",f)}function q(a,b,c,d,e){if(c.isArr){var f=0,g=b.length;for(f=0;f<g;f++)e("",d(b[f]))}else if(c.isObj){var h;for(h in b)b.hasOwnProperty(h)&&e(h,d(b[h]))}else e("",d(b))}function r(a){var c=!1,d=!1,e=!0;return null!==a&&void 0!==a&&(c=a.constructor===Array,d=a.constructor===Object,e=c&&0===a.length||d&&b(a)),{isArr:c,isObj:d,isUndef:e}}function s(a,b,c){this.name=unescape(a),this.valueHandler=b,this.maxLength=c}d.prototype.get=function(b){var c=this.lookupRaw(b),d=c;if(a(c)){var e=this.cache[b];null!==e&&void 0!==e?d=e.val:(d=c(this.raw),this.cache[b]={key:b,val:d})}return d},d.prototype.lookupRaw=function(a){return d.lookup(this,this.raw,a)},d.lookup=function(a,b,c){var e=b[c];if(void 0!==e)return e;var f=c.split("."),g=0,h=f.length-1;for(g=0;g<h;g++){var i=f.slice(0,h-g).join("."),j=f.slice(-g-1).join("."),k=b[i];if(void 0!==k)return d.lookup(a,k,j)}},e.prototype.expand=function(a){var b=new d(a),c="",e=0,f=this.set.length;for(e=0;e<f;e++)c+=this.set[e].expand(b);return c},f.prototype.expand=function(){return this.txt};var t=new RegExp("[:/?#\\[\\]@!$&()*+,;=']","g"),u={prefix:"",joiner:",",encode:g,builder:i},v={prefix:"",joiner:",",encode:h,builder:i},w={prefix:"#",joiner:",",encode:h,builder:i},x={prefix:";",joiner:";",encode:g,builder:k},y={prefix:"?",joiner:"&",encode:g,builder:j},z={prefix:"&",joiner:"&",encode:g,builder:j},A={prefix:"/",joiner:"/",encode:g,builder:i},B={prefix:".",joiner:".",encode:g,builder:i};l.build=function(a,b){var c;switch(a){case"":c=u;break;case"+":c=v;break;case"#":c=w;break;case";":c=x;break;case"?":c=y;break;case"&":c=z;break;case"/":c=A;break;case".":c=B;break;default:throw"Unexpected operator: '"+a+"'"}return new l(c,b)},l.prototype.expand=function(a){var b=this.prefix,c=this.joiner,d=this.builder,e="",f=0,g=this.vars.length;for(f=0;f<g;f++){var h=this.vars[f];h.addValues(a,this.encode,function(a,f,g){var i=d(h.name,a,f,g);null!==i&&void 0!==i&&(e+=b+i,b=c)})}return e};var C={};m.prototype.append=function(a,b){return this.appender(this,a,b)},m.UnboundAppend=function(a,b,c){return b=c?c(b):b,a.str+=b,a},m.BoundAppend=function(a,b,c){return b=b.substring(0,a.limit-a.len),a.len+=b.length,b=c?c(b):b,a.str+=b,a},s.build=function(a,b,c,d){var e;return e=b?q:p,c||(d=C),new s(a,e,d)},s.prototype.addValues=function(a,b,c){var d=a.get(this.name),e=r(d);e.isUndef||this.valueHandler(this,d,e,b,c)};var D=/([^*:]*)((\*)|(:)([0-9]+))?/,E=function(a){var b=a[1],c=a[3],d=a[4],e=parseInt(a[5],10);return s.build(b,c,d,e)},F=",",G=/(\{([+#.;?&\/])?(([^.*:,{}|@!=$()][^*:,{}$()]*)(\*|:([0-9]+))?(,([^.*:,{}][^*:,{}]*)(\*|:([0-9]+))?)*)\})/g,H=function(a){var b=(a[0],a[2]||""),c=a[3].split(F),d=0,e=c.length;for(d=0;d<e;d++){var f;if(null===(f=c[d].match(D)))throw"unexpected parse error in varspec: "+c[d];c[d]=E(f)}return l.build(b,c)},I=function(a,b,c,d){if(c<d){var e=b.substr(c,d-c);a.push(new f(e))}},J=function(a){var b,c=0,d=[],f=G;for(f.lastIndex=0;null!==(b=f.exec(a));){var g=b.index;I(d,a,c,g),d.push(H(b)),c=f.lastIndex}return I(d,a,c,a.length),new e(d)};return J}(),apigClientFactory={};apigClientFactory.newClient=function(a){var b={};void 0===a&&(a={accessKey:"",secretKey:"",sessionToken:"",region:"",apiKey:void 0,defaultContentType:"application/json",defaultAcceptType:"application/json"}),void 0===a.accessKey&&(a.accessKey=""),void 0===a.secretKey&&(a.secretKey=""),void 0===a.apiKey&&(a.apiKey=""),void 0===a.sessionToken&&(a.sessionToken=""),void 0===a.region&&(a.region="us-east-1"),void 0===a.defaultContentType&&(a.defaultContentType="application/json"),void 0===a.defaultAcceptType&&(a.defaultAcceptType="application/json");var c="https://13fxqrqkhe.execute-api.us-east-1.amazonaws.com/production",d=/(^https?:\/\/[^\/]+)/g.exec(c)[1],e=c.substring(d.length),f={accessKey:a.accessKey,secretKey:a.secretKey,sessionToken:a.sessionToken,serviceName:"execute-api",region:a.region,endpoint:d,defaultContentType:a.defaultContentType,defaultAcceptType:a.defaultAcceptType},g="NONE";void 0!==f.accessKey&&""!==f.accessKey&&void 0!==f.secretKey&&""!==f.secretKey&&(g="AWS_IAM");var h={endpoint:d,defaultContentType:a.defaultContentType,defaultAcceptType:a.defaultAcceptType},i=apiGateway.core.apiGatewayClientFactory.newClient(h,f);return b.gremlinPost=function(b,c,d){void 0===d&&(d={}),apiGateway.core.utils.assertParametersDefined(b,[],["body"]);var f={verb:"post".toUpperCase(),path:e+uritemplate("/gremlin").expand(apiGateway.core.utils.parseParametersToObject(b,[])),headers:apiGateway.core.utils.parseParametersToObject(b,[]),queryParams:apiGateway.core.utils.parseParametersToObject(b,[]),body:c};return i.makeRequest(f,g,d,a.apiKey)},b};