const {
	isGetter,
	isSetter,
	defineGetterSetter,
	defineGetter,
	defineSetter,
	defineProperty
} = require('./defineDescriptors');

function _in(target, origTarget, _sources, origSources) {
	for (let src of origSources) {
		for (let descriptor in src) {
			_sources.names.push(descriptor);
			//To prevent false definitions with getter/setter on target
			if (
				origTarget.hasOwnProperty(descriptor) &&
				(isGetter(origTarget, descriptor) || isSetter(origTarget, descriptor))
			) {
				delete target[descriptor];
			}
			//Pseudo descriptor property : has Getter & Setter
			if (isGetter(src, descriptor) && isSetter(src, descriptor)) {
				defineGetterSetter(target, descriptor, src);
				_sources.info.push({
					name: descriptor,
					dest_has_name: origTarget.hasOwnProperty(descriptor)
				});
				continue;
			}
			//descriptor is getter only
			if (isGetter(src, descriptor)) {
				defineGetter(target, descriptor, src);
				_sources.info.push({
					name: descriptor,
					dest_has_name: origTarget.hasOwnProperty(descriptor)
				});
				continue;
			}

			//descriptor is setter only
			if (isSetter(src, descriptor)) {
				defineSetter(target, descriptor, src);
				_sources.info.push({
					name: descriptor,
					dest_has_name: origTarget.hasOwnProperty(descriptor)
				});
				continue;
			}

			//descriptor is data property or normal function
			defineProperty(target, descriptor, src);
			_sources.info.push({
				name: descriptor,
				dest_has_name: origTarget.hasOwnProperty(descriptor)
			});
		}
	}
}

function checkIn(bool) {
	if (bool) throw Error(' The method [In] can only be used once!');
}
module.exports = { _in, checkIn };
