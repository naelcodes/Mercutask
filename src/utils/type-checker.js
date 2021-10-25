/**
 * Checks if an argument or a list of arguments is of a given type
 * @param {Array|object} args Arguments
 * @param {string} argType Expected Type
 * @param {boolean=} throw_error Specifies whether an error should be thrown
 * @param {string=} msg Error Message
 * @returns information about the arguments
 */
function checkType(args, argType, throw_error = false, msg) {
	let arg = Array.isArray(args) ? [...args] : Array.of(args);
	let value = true;
	let result = {};
	result.info = [];
	for (let i = 0; i < arg.length; i++) {
		if (throw_error) {
			if (typeof arg[i] !== argType) {
				throw new TypeError(
					msg || `Incorrect type. args - [ value: ${args[i]} ] must be of type ${argType}`
				);
			}
		}

		value = typeof arg[i] === argType;
		result.info.push({ args_value: arg[i], args_type: typeof arg[i] });
	}

	result.value = value;
	return result;
}

module.exports = checkType;
