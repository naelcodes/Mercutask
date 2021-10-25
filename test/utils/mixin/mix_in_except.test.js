const expect = require('chai').expect;

describe('mix().in().except()', () => {
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

	it("should throw an error if the names being passed to except() isn't a string or a list of string values", () => {
		let handler1 = () => mix(obj2).in(obj1).except(true, false);
		let handler2 = () => mix(obj2).in(obj1).except('isMixed', false);
		let handler3 = () => mix(obj2).in(obj1).except();
		expect(handler1).to.throw(TypeError);
		expect(handler2).to.throw(TypeError);
		expect(handler3).to.throw();
	});

	it('should throw an error if expect() is used before the target is specified using [in()]', () => {
		let handler = () => mix(obj2).except('isMixed').in(obj1);
		expect(handler).to.throw();
	});

	it('should throw an error if expect() is used twice', () => {
		let handler = () => mix(obj2).in(obj1).except('isMixed').except('hello');
		expect(handler).to.throw();
	});

	it('should throw a Reference error if the name specified  in expect() is absent in source object(s)', () => {
		let handler = () => mix(obj2).in(obj1).except('pituitary');
		let handler2 = () => mix(obj2, { yallo: 'ok', isYou: true }).in(obj1).except('name', 'yallu');
		expect(handler).to.throw(ReferenceError);
		expect(handler2).to.throw(ReferenceError);
	});

	it("should clone the source's descriptors in target except those specified in except()", () => {
		mix(obj2).in(obj1).except('name', 'something');
		expect(obj1).to.not.have.own.property('name', 'obj2');
		expect(obj1).to.have.ownPropertyDescriptor('isMixed');
		expect(obj1).to.have.ownPropertyDescriptor('hello');
		expect(obj1).to.not.have.own.property('something');
	});
});
