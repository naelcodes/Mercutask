'use strict';

/**
 * Parses the Body of Request
 * @param {Object} req Node http Request Object
 * @returns {Promise<Object>}
 */
async function bodyJSONParser(req) {
	let data = {};
	let chunk = '';
	try {
		chunk += await dataChunk(req);
		data = JSON.parse(chunk.toString());
	} catch (error) {
		data.error = error;
		return data;
	}
	return data;
}

function dataChunk(req) {
	return new Promise((resolve, reject) => {
		try {
			let rawChunk = null;
			req.on('data', (chunk) => {
				rawChunk = chunk;
			});

			req.on('end', () => {
				resolve(rawChunk);
			});
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = bodyJSONParser;
