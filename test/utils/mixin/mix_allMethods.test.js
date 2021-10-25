const expect = require('chai').expect;

describe('mix().in().* - methods combinations', () => {
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
	it('should throw an error when except() is used if only() has been used in the chain', () => {
		let handler = () => mix(obj2).in(obj1).only('name', 'isMixed').redefine(false).except('hello');
		expect(handler).to.throw();
	});
	it('should throw an error when only() is used if except() has been used in the chain', () => {
		let handler = () => mix(obj2).in(obj1).except('hello').redefine(false).only('name', 'isMixed');
		expect(handler).to.throw();
	});
	it('should throw an error when set() is used after only has been used in the chain ', () => {
		let handler = () => mix(obj2).in(obj1).only('name', 'isMixed').redefine(false).set('fields');
		expect(handler).to.throw();
	});

	context('SHOULD Clone successfully The Descriptors Of The Source In Target When :', () => {
		let obj3, obj4;
		beforeEach(() => {
			obj3 = { field: 'val1', prop: 'val2' };
			obj4 = {
				a: 'ok',
				miaou() {
					return 'Miaou';
				}
			};
		});
		it('Combination - mix().in().set().only().redefine() - is used ', () => {
			mix(obj2, obj3, obj4).in(obj1).set('fields').only('a', 'field', 'name').redefine(false);

			expect(obj1).to.have.own.property('a', 'ok');
			expect(obj1).to.have.own.property('name', 'obj1');
			expect(obj1).to.have.own.property('field', 'val1');
			expect(obj1).to.not.have.own.property('prop');
			expect(obj1).to.not.have.own.property('isMixed');
		});

		it('Combination - mix().in().except().redefine().set() - is used ', () => {
			mix(obj2, obj3, obj4).in(obj1).except('hello').redefine(false).set('methods');

			expect(obj1).to.have.ownPropertyDescriptor('miaou');
			expect(obj1).to.have.ownPropertyDescriptor('something');
			expect(obj1).to.not.have.own.property('name', 'obj2');
			expect(obj1).to.have.own.property('name', 'obj1');
			expect(obj1).to.not.have.own.property('field', 'val1');
		});
	});
});
