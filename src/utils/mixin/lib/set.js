function set(setValue, target, origTarget, _sources) {
	if (setValue === 'fields') {
		for (let descriptor in target) {
			if (
				typeof target[descriptor] === 'function' &&
				_sources.names.includes(descriptor) &&
				!origTarget.hasOwnProperty(descriptor)
			) {
				delete target[descriptor];
			}
		}
	}

	if (setValue === 'methods') {
		for (let descriptor in target) {
			if (
				typeof target[descriptor] !== 'function' &&
				_sources.names.includes(descriptor) &&
				!origTarget.hasOwnProperty(descriptor)
			) {
				delete target[descriptor];
			}
		}
	}
}

function checkSet(wasInCalled, wasOnlyCalled, wasSetCalled) {
	if (!wasInCalled) {
		throw Error(
			' The method [set()] can be used only when the target has been defined using the method [In()]'
		);
	}
	if (wasOnlyCalled) {
		throw Error(" The method [set()] can't be used after method [only()] was used");
	}
	if (wasSetCalled) {
		throw Error(' The method [set()] can only be used once!');
	}
}

module.exports = { set, checkSet };
