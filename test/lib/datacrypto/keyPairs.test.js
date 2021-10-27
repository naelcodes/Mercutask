// @ts-nocheck
const expect = require('chai').expect;
const { genRSAKeyPair } = require('../../../src/lib/datacrypto');
const path = require('path');
const fs = require('fs/promises');
describe('RSA Key Generation', () => {
	describe('genRSAKeyPair()', function () {
		let _path = path.join(__dirname, 'Keys');
		before((done) => {
			fs.rm(path.join(_path, '/public.pem'));
			fs.rm(path.join(_path, '/private.pem'));
			done();
		});
		it('should generate RSA public and private key pair with the given key names, in the given path', (done) => {
			let { publicKey, privateKey } = genRSAKeyPair(_path, 'public', 'private');
			let createdPublicKey = fs.readFile(path.join(_path, '/public.pem'), 'utf-8');
			let createdPrivateKey = fs.readFile(path.join(_path, '/private.pem'), 'utf-8');
			done();
			expect(publicKey).to.not.be.undefined;
			expect(privateKey).to.not.be.undefined;
			expect(publicKey).to.equal(createdPublicKey);
			expect(privateKey).to.equal(createdPrivateKey);
		});
	});
});
