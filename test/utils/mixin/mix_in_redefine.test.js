const expect = require('chai').expect;

describe('mix().in().redefine()', () => {
	const { mix } = require('../../../src/utils');
	let obj1, obj2;
	beforeEach(function () {
		obj1 = { name: 'obj1' };
		obj2 = {
			name: 'obj2',
			isMixed: false,
			hello() {
				return 'Hello';
			},
			something() {
				return 'try something';
			}
		};
	});

	it('should throw an error if method [redefine()] is used before specifying the target with the method [in()]', () => {
		let handler = () => mix(obj2).redefine(false).in(obj1);
		expect(handler).to.throw();
	});

	it('should throw an error if method [redefine()] is used twice', () => {
		let handler = () => mix(obj2).in(obj1).redefine(false).redefine(true);
		expect(handler).to.throw();
	});

	it("should throw an error if method [redefine()] doesn't receive a boolean value as parameter", () => {
		// @ts-ignore
		let handler = () => mix(obj2).in(obj1).redefine('false');
		expect(handler).to.throw();
	});

	it('should not redefine the target descriptor if redefine() is set to false', () => {
		mix(obj2).in(obj1).redefine(false);
		expect(obj1.name).to.equal('obj1');
	});

	it("should redefine the target descriptor if redefine() isn't used or set to true", () => {
		mix(obj2).in(obj1);
		expect(obj1.name).to.equal('obj2');
	});

	it('Should redefine Getter & Setters properly');
});
