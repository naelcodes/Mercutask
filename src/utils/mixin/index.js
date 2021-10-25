const ObjectMixinBuilder = require('./objMixinBuilder');
/**
 * Mix Object fields/Methods descriptor in target
 * @param  {...any} args Object to mix in target
 */
const mix = (...args) => {
	if (args.length === 0) {
		throw Error('Requires a source object(s)');
	}
	return new ObjectMixinBuilder(...args);
};

module.exports = mix;
