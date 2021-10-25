const expect = require('chai').expect;

describe('mix().in().set()', () => {
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

	it('should throw an error if the argument of method [set()] is not a string', () => {
		// @ts-ignore
		let handler = () => mix(obj2).in(obj1).set(true);
		expect(handler).to.throw();
	});
	it('should throw an error if the argument of method [set()] is not equal to "fields" or "methods" ', () => {
		let handler = () => mix(obj2).in(obj1).set('nation');
		expect(handler).to.throw();
	});

	it('should throw an error if method [set()] is used before the target is given using the method [in()]', () => {
		let handler = () => mix(obj2).set('fields').in(obj1);
		expect(handler).to.throw();
	});

	it('should throw an error if method [set()] is used twice', () => {
		let handler = () => mix(obj2).set('fields').set('methods');
		expect(handler).to.throw();
	});

	it('should clone only  fields descriptors and their corresponding value to the target if set() is set to "fields"', () => {
		mix(obj2).in(obj1).set('fields');
		expect(obj1).to.have.own.property('name', 'obj2');
		expect(obj1).to.have.ownPropertyDescriptor('isMixed');
		expect(obj1).to.not.have.ownPropertyDescriptor('hello');
		expect(obj1).to.not.have.ownPropertyDescriptor('something');
	});

	it('should clone only methods descriptors to the target if set() is set to "methods"', () => {
		mix(obj2).in(obj1).set('methods');
		expect(obj1).to.have.own.property('name', 'obj2');
		expect(obj1).to.not.have.ownPropertyDescriptor('isMixed');
		expect(obj1).to.have.ownPropertyDescriptor('hello');
		expect(obj1).to.have.ownPropertyDescriptor('something');
	});
});
