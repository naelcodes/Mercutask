const expect = require('chai').expect;
const { hashPassword, comparePassword } = require('../../../src/lib/datacrypto');
describe('Hashing logic', () => {
	let pwd1 = '#sfjlsf124',
		pwd1Hash;
	before(async () => {
		({ hash: pwd1Hash } = await hashPassword(pwd1));
	});
	describe('hashPassword()', () => {
		it('should successfully create different hashes for different passwords', async () => {
			let pwd2 = 'dcf_f#sf12',
				pwd3 = '00xcvw_dfevA',
				pwd2Hash,
				pwd3Hash;
			({ hash: pwd2Hash } = await hashPassword(pwd2));
			({ hash: pwd3Hash } = await hashPassword(pwd3));
			expect(pwd1Hash).to.not.equal(pwd2Hash);
			expect(pwd1Hash).to.not.equal(pwd3Hash);
			expect(pwd2Hash).to.not.equal(pwd3Hash);
		});
	});

	describe('comparePassword()', () => {
		it('should report valid when a plain text password is compared to its corresponding hash', async () => {
			let { isValid } = await comparePassword(pwd1, pwd1Hash);
			expect(isValid).to.be.true;
		});
		it('should report NOT valid when a plain text password is compared to its corresponding hash', async () => {
			let { isValid } = await comparePassword('#gibberishpass', pwd1Hash);
			expect(isValid).to.not.be.true;
		});
	});
});
