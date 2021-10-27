//@ts-ignore
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const util = require('util');

const asyncKeyPair = util.promisify(crypto.generateKeyPair);
/**
 * Generate a public & private Cryptographic RSA keys
 * @param {string} _path location where the keys will be stored
 * @param {string} publicKeyName name of public key
 * @param {string} privateKeyName name of private key
 */
async function genRSAKeyPair(_path, publicKeyName, privateKeyName) {
	try {
		const KeyPair = await asyncKeyPair('rsa', {
			modulusLength: 4096,
			publicKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			},
			privateKeyEncoding: {
				type: 'pkcs1',
				format: 'pem'
			}
		});

		await fs.writeFile(path.join(_path, `/${publicKeyName}.pem`), KeyPair.publicKey);
		await fs.writeFile(path.join(_path, `/${privateKeyName}.pem`), KeyPair.privateKey);
		return Promise.resolve(KeyPair);
	} catch (error) {
		return Promise.reject({ err: error.message });
	}
}

module.exports = genRSAKeyPair;
