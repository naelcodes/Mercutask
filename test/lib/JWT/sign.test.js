// @ts-nocheck
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs/promises');

const JWT = require('../../../src/lib/JWT/index');
const Base64url = require('../../../src/lib/base64url');
const dir = 'd:\\Dev\\Mercury\\libs\\src\\JWT';
const privateKeyFile = '/priv_key.pem';

describe('sign()', () => {
	let payload1, payload2;
	let expiredIn = '1d';
	let privateRSAKey;
	before(async () => {
		privateRSAKey = await fs.readFile(path.join(dir, privateKeyFile), 'utf-8');
		payload1 = {
			name: 'dcrativ'
		};
		payload2 = {
			name: 'dev'
		};
	});

	it('should produce different signature for different payloads', async () => {
		let jwtOne, jwtTwo, jwtErr, signature1, signature2;

		try {
			({ jwt: jwtOne } = await JWT.sign(payload1, privateRSAKey, expiredIn));
			({ jwt: jwtTwo } = await JWT.sign(payload2, privateRSAKey, expiredIn));
			console.log(jwtOne);
			signature1 = jwtOne.split('.')[2];
			signature2 = jwtTwo.split('.')[2];
		} catch (err) {
			({ err: jwtErr } = err);
		}
		expect(jwtErr).to.not.be.an.instanceOf(Error);
		expect(jwtErr).to.be.undefined;
		expect(signature1).not.to.equal(signature2);
	});

	it('should add the expiry time to the payload', async () => {
		let jwtOne, jwtErr, exp;

		try {
			({ jwt: jwtOne } = await JWT.sign(payload1, privateRSAKey, expiredIn));

			exp = JSON.parse(Base64url.decode(jwtOne.split('.')[1])).exp;
		} catch (err) {
			({ err: jwtErr } = err);
		}
		expect(jwtErr).to.not.be.an.instanceOf(Error);
		expect(jwtErr).to.be.undefined;
		expect(exp).to.be.a('number');
	});
});
