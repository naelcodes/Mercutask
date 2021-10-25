/**
 * Module Dependencies
 */

const checkType = require('../type-checker');
const { _in, checkIn } = require('./lib/_in');
const { only: _only, checkOnly } = require('./lib/only');
const { except: _except, checkExcept } = require('./lib/except');
const { set: _set, checkSet } = require('./lib/set');
const { redefine: _redefine, checkRedefine } = require('./lib/redefine');
const ObjectCopy = require('../object');

/**
 * Class used to mix an object property methods and fields descriptors
 * in to another object
 */
class ObjectMixinBuilder {
	#target = {};
	#origTarget = {};
	#_sources = {
		names: [],
		info: []
	};
	#setValue = null;
	#origSources = null;
	#wasInCalled = false;
	#wasSetCalled = false;
	#wasOnlyCalled = false;
	#wasExceptCalled = false;
	#wasRedefineCalled = false;

	/**
	 * @param  {...any} sources Objects to be cloned in target
	 */
	constructor(...sources) {
		checkType(sources, 'object', true);
		this.#origSources = sources;
	}

	/** Used to specify the target to which descriptors will be cloned
	 * @param {Object} target - Object to which the descriptors will be cloned
	 * @returns {ObjectMixinBuilder}
	 */
	in(target) {
		checkType(
			target,
			'object',
			true,
			`[in()] requires a String value as argument but got a type ${typeof target}`
		);

		this.#checkBuilder('IN');

		this.#origTarget = ObjectCopy(target);
		this.#target = target;

		_in(this.#target, this.#origTarget, this.#_sources, this.#origSources);

		this.#wasInCalled = true;
		return this;
	}

	/**
	 * Clones only the descriptors with the names provided
	 * @param  {...any} names
	 * @returns {ObjectMixinBuilder}
	 */
	only(...names) {
		checkType(names, 'string', true);
		this.#checkBuilder('ONLY');
		_only(names, this.#_sources, this.#target, this.#origTarget);
		this.#wasOnlyCalled = true;
		return this;
	}

	/**
	 * Specifies the name of the source's descriptors
	 * that shouldn't be cloned to the target
	 * @param  {...any} names
	 * @returns {ObjectMixinBuilder}
	 */
	except(...names) {
		checkType(names, 'string', true);
		this.#checkBuilder('EXCEPT');
		_except(names, this.#_sources, this.#target, this.#origTarget);
		this.#wasExceptCalled = true;
		return this;
	}

	/**
	 * Specifies whether either the fields property descriptors or
	 * method property descriptors will be cloned to the target
	 *
	 * if arg = "fields"
	 * @param {String} arg
	 * @returns {ObjectMixinBuilder}
	 */
	set(arg) {
		checkType(
			arg,
			'string',
			true,
			`Set() requires a String value as argument but got a type ${typeof arg}`
		);

		this.#checkBuilder('SET');

		if (arg !== 'fields' && arg !== 'methods') {
			throw Error('The parameter of set() must be "fields" or "methods"');
		}

		this.#setValue = arg;
		_set(this.#setValue, this.#target, this.#origTarget, this.#_sources);

		this.#wasSetCalled = true;
		return this;
	}

	/**
	 * Determines whether the target's descriptors having similar names
	 * like the source descriptor will be redefine
	 *
	 * if false the target will conserve it original descriptors
	 * if true the target descriptor will be redefine with the source descriptors
	 *
	 * by default it's true
	 *
	 * @param {Boolean} redefine
	 * @returns {ObjectMixinBuilder}
	 */
	redefine(redefine) {
		checkType(
			redefine,
			'boolean',
			true,
			`Redefine() requires a boolean value as argument but got a type ${typeof redefine}`
		);

		this.#checkBuilder('REDEFINE');

		_redefine(redefine, this.#target, this.#origTarget, this.#_sources);

		this.#wasRedefineCalled = true;
		return this;
	}

	/**
	 * Used to check which method where used in chaining
	 * and throw errors where necessary
	 * @param {string} method Builder Methods
	 */
	#checkBuilder(method) {
		switch (method) {
			case 'IN':
				checkIn(this.#wasInCalled);
				break;

			case 'SET':
				checkSet(this.#wasInCalled, this.#wasOnlyCalled, this.#wasSetCalled);
				break;
			case 'ONLY':
				checkOnly(this.#wasInCalled, this.#wasExceptCalled, this.#wasOnlyCalled);
				break;

			case 'EXCEPT':
				checkExcept(this.#wasInCalled, this.#wasOnlyCalled, this.#wasExceptCalled);
				break;

			case 'REDEFINE':
				checkRedefine(this.#wasInCalled, this.#wasRedefineCalled);
				break;
		}
	}
}

module.exports = ObjectMixinBuilder;
