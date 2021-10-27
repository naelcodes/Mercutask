const Crypto = require('crypto');

const Base64url = require('../../base64url');
const getMilliseconds = require('../../moments');

const jwtHeader = {
	alg: 'RS256',
	typ: 'JWT'
};

/**
 * create signed JWT with a signature, payload and expiry date
 * @param {object} payload
 * @param {string} privateKey private RSA Key
 * @param {string} expiresIn
 * @returns Signed JWT or an Error if any
 */
function sign(payload, privateKey, expiresIn = '1d') {
	try {
		const encodedHeader = Base64url.encode(JSON.stringify(jwtHeader));
		const iat = Date.now();
		const exp = iat + getMilliseconds(expiresIn);
		const encodedPayload = Base64url.encode(JSON.stringify({ ...payload, iat, exp }));
		const encodedSignature = createSignature(encodedHeader, encodedPayload, privateKey);
		const jwt = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

		return Promise.resolve({ jwt });
	} catch (err) {
		return Promise.resolve({ err: err.message });
	}
}

/**
 * Creates a signature for JWT
 * @param {string} encodedHeader Base64url encoded jwt header
 * @param {string} encodedPayload Base64url encoded jwt payload
 * @param {string} privateKey RSA private key
 */
function createSignature(encodedHeader, encodedPayload, privateKey) {
	const signature = Crypto.createSign('RSA-SHA256');
	signature.write(`${encodedHeader}.${encodedPayload}`);
	signature.end();
	let base64Signature = signature.sign(privateKey, 'base64');
	let base64UrlSignature = Base64url.encode(base64Signature, 'base64');
	return base64UrlSignature;
}

module.exports = sign;
