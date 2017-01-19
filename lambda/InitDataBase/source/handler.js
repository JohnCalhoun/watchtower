var CfnLambda = require('cfn-lambda');
var create=require('create.js');
var Delete=require('delete.js');
var update=require('update.js');

exports.handler=CfnLambda({
    Create:create,
    Update:update,
    Delete:Delete
})
