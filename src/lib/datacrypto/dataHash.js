const { pbkdf2, randomBytes, timingSafeEqual } = require('crypto');
const util = require('util');
const { Buffer } = require('buffer');

const asyncPBKDF2 = util.promisify(pbkdf2);
const asyncRandomBytes = util.promisify(randomBytes);

const enc_dec = require('../enc_dec');

async function hashPassword(password) {
	try {
		let hash;
		let saltBytes = 64;
		let uniqueSalt = (await asyncRandomBytes(saltBytes)).toString('base64');
		let iterations = 100000;
		let algo = 'sha512';

		//format : $Algo-info$NumberOfRounds$UniqueSalt.ResultingHasHOfPwd
		let base64Iterations = enc_dec.encode(String(iterations)).to('base64').output;
		let algoBase64 = enc_dec.encode(algo).to('base64').output;

		let hashHeader = [algoBase64, base64Iterations, uniqueSalt].join('$');

		let derivedKey = await asyncPBKDF2(password, uniqueSalt, iterations, 64, algo);
		let base64pwdHash = derivedKey.toString('base64');
		hash = [hashHeader, base64pwdHash].join('.');
		return { hash };
	} catch (err) {
		return Promise.reject({ err: err.message });
	}
}

async function comparePassword(plainTxtPwd, hashToCompare) {
	try {
		let isValid = false;
		let hashParts = hashToCompare.split('.');

		let [algoBase64, base64Iterations, uniqueSalt] = hashParts[0].split('$');

		//Check if the iterations is a number
		let iterations = parseInt(enc_dec.decode(base64Iterations, 'base64').to().output);

		let algo = enc_dec.decode(algoBase64, 'base64').to().output; //utf-8
		let bufferOfHash = Buffer.from(hashParts[1], 'base64');

		let newDerivedKey = await asyncPBKDF2(plainTxtPwd, uniqueSalt, iterations, 64, algo);

		isValid = timingSafeEqual(newDerivedKey, bufferOfHash);

		return { isValid };
	} catch (err) {
		return Promise.reject({ err: err.message });
	}
}

module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
