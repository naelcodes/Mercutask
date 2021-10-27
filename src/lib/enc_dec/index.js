// @ts-nocheck
const { Buffer } = require('buffer');

class EncodeDecode {
	#inputData;
	#inputEncoding;
	constructor(inputData, inputEncoding = 'utf8') {
		if (typeof inputData !== 'string') {
			throw Error('inputData must be a string');
		}
		if (typeof inputEncoding !== 'string') {
			throw Error('inputEncoding must be a string');
		}
		this.#inputData = inputData;
		this.#inputEncoding = inputEncoding;
	}
	to(outputEncoding = 'utf8') {
		if (typeof outputEncoding !== 'string') {
			throw Error('inputEncoding must be a string');
		}
		try {
			let output = Buffer.from(this.#inputData, this.#inputEncoding).toString(outputEncoding);
			return { output };
		} catch (error) {
			return { err: err.message };
		}
	}
}

const encode = (inputData, inputEncoding) => new EncodeDecode(inputData, inputEncoding);
const decode = (inputData, inputEncoding) => new EncodeDecode(inputData, inputEncoding);

module.exports.encode = encode;
module.exports.decode = decode;
