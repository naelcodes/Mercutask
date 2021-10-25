function except(names, _sources, target, origTarget) {
	if (names.length === 0) {
		throw Error('except() Requires sting values');
	}

	for (let descriptor_name of names) {
		if (_sources.names.includes(descriptor_name)) {
			if (!origTarget.hasOwnProperty(descriptor_name)) {
				delete target[descriptor_name];
			} else {
				//restore to original state
				target[descriptor_name] = origTarget[descriptor_name];
			}
		} else {
			throw ReferenceError(`The descriptor with name: ${descriptor_name} is not found in source`);
		}
	}
}

function checkExcept(wasInCalled, wasOnlyCalled, wasExceptCalled) {
	if (!wasInCalled) {
		throw Error(
			' The method [except()] can be used only when the target has been defined using the method [In()]'
		);
	}
	if (wasOnlyCalled) {
		throw Error("The method [except()] can't be used when the method [only()] was used");
	}
	if (wasExceptCalled) {
		throw Error(' The method [except()] can only be used once! ');
	}
}
module.exports = { except, checkExcept };
