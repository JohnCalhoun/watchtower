var swf=require("./swf.js");module.exports.create=function(a){var b=new Promise(function(b,c){if("Create"===a.RequestType|"Update"===a.RequestType){var d=a.ResourceProperties;swf.createDomain(d).then(b,c)}else b()});return b},module.exports.destory=function(a){var b=new Promise(function(b,c){"Delete"===a.RequestType|"Update"===a.RequestType?swf.deleteDomain(a).then(b,c):b()});return b};