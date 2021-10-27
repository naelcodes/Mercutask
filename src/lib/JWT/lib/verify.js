const Crypto = require('crypto');

const Base64url = require('../../base64url');

function verify(jwt, publicRSAKey) {
	try {
		const jwtParts = jwt.split('.');

		if (jwtParts.length !== 3) {
			throw new Error('Invalid token');
		}

		const [jwtHeader, jwtPayload, jwtSignature] = jwtParts;
		const isSignatureValid = verifySignature(jwtHeader, jwtPayload, jwtSignature, publicRSAKey);

		if (!isSignatureValid) {
			throw new Error('Invalid Signature');
		}

		const payload = JSON.parse(Base64url.decode(jwtPayload));
		if (isTokenExpired(payload.exp)) {
			throw new Error('Token has Expired');
		}
		return Promise.resolve({ payload });
	} catch (err) {
		return Promise.reject({ err: err.message });
	}
}

function verifySignature(jwtHeader, jwtPayload, jwtSignature, publicRSAKey) {
	const verifyFn = Crypto.createVerify('RSA-SHA256');
	verifyFn.write(`${jwtHeader}.${jwtPayload}`);
	verifyFn.end();
	const jwtSignatureBase64 = Base64url.decode(jwtSignature, 'base64');
	return verifyFn.verify(publicRSAKey, jwtSignatureBase64, 'base64');
}
function isTokenExpired(timestamp) {
	return new Date(timestamp).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);
}

module.exports = verify;
