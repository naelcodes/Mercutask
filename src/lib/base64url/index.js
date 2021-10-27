// @ts-nocheck
const { Buffer } = require('buffer');

function encode(input, inputEncoding = 'utf-8') {
	// @ts-ignore
	return Buffer.from(input, inputEncoding).toString('base64url');
}
function decode(base64url, OutputEncoding = 'utf-8') {
	return Buffer.from(base64url, 'base64url').toString(OutputEncoding);
}

module.exports.encode = encode;
module.exports.decode = decode;
