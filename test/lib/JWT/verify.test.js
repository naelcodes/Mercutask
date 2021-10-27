// @ts-nocheck
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs/promises');

const JWT = require('../../../src/lib/JWT');
const dir = 'd:\\Dev\\Mercury\\libs\\src\\JWT';
const publicKeyFile = '/public_key.pem';
const privateKeyFile = '/priv_key.pem';

describe('verify()', () => {
	let payload;
	let expiredIn = '1d';
	let publicRSAKey, privateRSAKey;
	let token;

	before(async () => {
		payload = {
			name: 'dcrativ'
		};

		publicRSAKey = await fs.readFile(path.join(dir, publicKeyFile), 'utf-8');
		privateRSAKey = await fs.readFile(path.join(dir, privateKeyFile), 'utf-8');
		({ jwt: token } = await JWT.sign(payload, privateRSAKey, expiredIn));
	});

	it('should verify and decode a valid token', async () => {
		console.log(token);
		const { payload: verified } = await JWT.verify(token, publicRSAKey);
		expect(verified.name).to.equal('dcrativ');
	});
	it('should throw an error if the signature is invalid', async () => {
		try {
			await JWT.verify(token, `${publicRSAKey}-tamperingkey`);
		} catch (e) {
			expect(e.message).to.equal('Invalid signature');
		}
	});
	it('should throw an error if the token has expired', async () => {
		const { jwt: expiredToken } = await JWT.sign(payload, publicRSAKey, '-1d');

		try {
			JWT.verify(expiredToken, publicRSAKey);
		} catch (err) {
			expect(err.message).to.equal('Token has expired');
		}
	});
});
