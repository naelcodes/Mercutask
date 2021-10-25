const {
	isGetter,
	isSetter,
	defineGetterSetter,
	defineGetter,
	defineSetter,
	defineProperty
} = require('./mixin/lib/defineDescriptors');

/**
 * Return a shallow copy of an object
 * @param {Object} obj Object to be copied
 * @returns copy of object
 */
function ObjectCopy(obj) {
	let copy = {};
	let names = Object.getOwnPropertyNames(obj);
	for (let name of names) {
		if (isGetter(obj, name) && isSetter(obj, name)) {
			defineGetterSetter(copy, name, obj);
			continue;
		}
		if (isGetter(obj, name)) {
			defineGetter(copy, name, obj);
			continue;
		}
		if (isSetter(obj, name)) {
			defineSetter(copy, name, obj);
			continue;
		}

		defineProperty(copy, name, obj);
	}
	return copy;
}

module.exports = ObjectCopy;
