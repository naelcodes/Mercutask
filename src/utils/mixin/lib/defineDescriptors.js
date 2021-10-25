function isGetter(obj, propertyName) {
	let result = Object.getOwnPropertyDescriptor(obj, propertyName);
	return result?.get ? true : false;
}

function isSetter(obj, propertyName) {
	let result = Object.getOwnPropertyDescriptor(obj, propertyName);
	return result?.set ? true : false;
}

function getGetter(obj, propertyName) {
	return Object.getOwnPropertyDescriptor(obj, propertyName).get;
}

function getSetter(obj, propertyName) {
	return Object.getOwnPropertyDescriptor(obj, propertyName).set;
}
function defineGetter(target, propertyName, source) {
	Object.defineProperty(target, propertyName, {
		get: getGetter(source, propertyName),
		configurable: true,
		enumerable: true
	});
}
function defineSetter(target, propertyName, source) {
	Object.defineProperty(target, propertyName, {
		set: getSetter(source, propertyName),
		configurable: true,
		enumerable: true
	});
}

function defineGetterSetter(target, propertyName, source) {
	Object.defineProperty(target, propertyName, {
		get: getGetter(source, propertyName),
		set: getSetter(source, propertyName),
		configurable: true,
		enumerable: true
	});
}

function defineProperty(target, propertyName, source) {
	target[propertyName] = source[propertyName];
}

module.exports = {
	isGetter,
	isSetter,
	getGetter,
	getSetter,
	defineGetter,
	defineSetter,
	defineProperty,
	defineGetterSetter
};
