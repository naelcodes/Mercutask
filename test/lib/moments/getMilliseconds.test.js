const expect = require('chai').expect;
const getMilliseconds = require('../../../src/lib/moments');

describe('getMilliseconds()', () => {
	it('should throw an error if the duration is not a string value', () => {
		const handler1 = () => getMilliseconds();
		const handler2 = () => getMilliseconds(true);
		const handler3 = () => getMilliseconds(123345);

		expect(handler1).to.throw(TypeError);
		expect(handler2).to.throw(TypeError);
		expect(handler3).to.throw(TypeError);
	});

	it('should throw an error if the duration has an incorrect format', () => {
		const handler1 = () => getMilliseconds('1day');
		const handler2 = () => getMilliseconds('1min');
		const handler3 = () => getMilliseconds('1sec');

		expect(handler1).to.throw(Error);
		expect(handler2).to.throw(Error);
		expect(handler3).to.throw(Error);
	});

	it('should give different milliseconds for different durations', () => {
		expect(getMilliseconds('1s')).to.equal(1000);
		expect(getMilliseconds('100s')).to.equal(100000);
		expect(getMilliseconds('5m')).to.equal(300000);
		expect(getMilliseconds('23m')).to.equal(1380000);
		expect(getMilliseconds('1.5h')).to.equal(5400000);
		expect(getMilliseconds('30d')).to.equal(2592000000);
	});

	it('should give negative milliseconds value for negative durations', () => {
		expect(getMilliseconds('-1s')).to.equal(-1000);
		expect(getMilliseconds('-23m')).to.equal(-1380000);
		expect(getMilliseconds('-20d')).to.equal(-1728000000);
	});
});
