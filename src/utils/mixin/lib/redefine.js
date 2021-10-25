const {
	isGetter,
	isSetter,
	defineGetterSetter,
	defineGetter,
	defineSetter,
	defineProperty
} = require('./defineDescriptors');

function redefine(redefine, target, origTarget, _sources) {
	if (!redefine) {
		for (let info of _sources.info) {
			if (info.dest_has_name) {
				if (isGetter(target, info.name) || isSetter(target, info.name)) {
					delete target[info.name];
				}

				if (isGetter(origTarget, info.name) && isSetter(origTarget, info.name)) {
					defineGetterSetter(target, info.name, origTarget);
					continue;
				}

				if (isGetter(origTarget, info.name)) {
					defineGetter(target, info.name, origTarget);
					continue;
				}

				if (isSetter(origTarget, info.name)) {
					defineSetter(target, info.name, origTarget);
					continue;
				}

				defineProperty(target, info.name, origTarget);
			}
		}
	}
}

function checkRedefine(wasInCalled, wasRedefineCalled) {
	if (!wasInCalled) {
		throw Error(
			' The method [redefine()] can be used only when the target has been defined using the method [In()]'
		);
	}
	if (wasRedefineCalled) {
		throw Error(' The method [redefine()] can only be used once!');
	}
}
module.exports = { redefine, checkRedefine };
