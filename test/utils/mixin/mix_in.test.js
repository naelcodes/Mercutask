const expect = require('chai').expect;

describe('mix().in()', () => {
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

	it('should throw an error if the source is not given', () => {
		let handler = () => mix().in(obj1);
		expect(handler).to.throw();
	});
	it('should throw an error if the source is not an object', () => {
		let handler = () => mix('hello').in(obj1);
		expect(handler).to.throw();
		expect(handler).to.throw(TypeError);
	});
	it('should throw an error if the target of the mixin is not given', () => {
		let handler = () => mix(obj1).in();
		expect(handler).to.throw();
		expect(handler).to.throw(TypeError);
	});

	it('should throw an error if the target is not an object', () => {
		let handler = () => mix(obj1).in('hello');
		expect(handler).to.throw();
		expect(handler).to.throw(TypeError);
	});

	it('should throw an error if the method [in()] is used twice', () => {
		let handler = () => {
			mix(obj2).in(obj1).in(obj1);
		};
		expect(handler).to.throw();
	});

	it('should clone the source descriptors in to the target', () => {
		mix(obj2).in(obj1);
		expect(obj1).to.haveOwnPropertyDescriptor('hello');
		expect(obj1).to.haveOwnPropertyDescriptor('isMixed');
		expect(obj1).to.haveOwnPropertyDescriptor('something');
		expect(obj1.name).to.equal('obj2');
	});

	it('should clone sources descriptors from multiple sources in target', () => {
		let obj3 = {
			prop1: 'props',
			func1() {
				return 'func1';
			}
		};
		let obj4 = {
			prop2: 'props2',
			func2() {
				return 'func2';
			}
		};
		mix(obj2, obj3, obj4).in(obj1);
		expect(obj1).to.haveOwnPropertyDescriptor('hello');
		expect(obj1).to.haveOwnPropertyDescriptor('isMixed');
		expect(obj1).to.haveOwnPropertyDescriptor('something');
		expect(obj1).to.have.property('name', 'obj2');
		expect(obj1).to.have.property('prop1', 'props');
		expect(obj1).to.have.property('prop2', 'props2');
		expect(obj1).to.haveOwnPropertyDescriptor('func1');
		expect(obj1).to.haveOwnPropertyDescriptor('func2');
		expect(obj1.something()).to.equal('try something');
	});

	it('should throw an error if one of the multiple sources is not a valid object', () => {
		let handler = () => mix(obj2, null, 'string').in(obj1);
		expect(handler).to.throw();
	});
});
