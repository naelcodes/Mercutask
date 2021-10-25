function only(names, _sources, target, origTarget) {
	if (names.length === 0) {
		throw Error('only() Requires string values');
	}

	for (let name of names) {
		if (!_sources.names.includes(name)) {
			throw ReferenceError(`The descriptor with name: ${name} is not found in source`);
		}
		if (!(name in target)) {
			throw ReferenceError(`The descriptor with name: ${name} is not found in target`);
		}
	}
	for (let descriptor_name in target) {
		if (!names.includes(descriptor_name) && !(descriptor_name in origTarget)) {
			delete target[descriptor_name];
		}
	}
}

function checkOnly(wasInCalled, wasExceptCalled, wasOnlyCalled) {
	if (!wasInCalled) {
		throw Error(
			' The method [only] can be used only when the target has been defined using the method [In()]'
		);
	}
	if (wasExceptCalled) {
		throw Error(" The method [only()] can't be used when the method [except()] was used");
	}
	if (wasOnlyCalled) {
		throw Error(' The method [only()] can only be used once!');
	}
}
module.exports = { only, checkOnly };
