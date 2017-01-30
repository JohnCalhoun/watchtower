var bitlength=1024
exports.client=require('./client.js')('modp18',bitlength);
exports.server=require('./server.js')('modp18',bitlength);

