const { pathRegex, checkType } = require('../../../utils');

/**
 * @class
 *Class use to create Router Layers.
  Layers can be route middlewares or normal middlewares.
 */
class Layer {
	/**
	 *
	 * @param {string} path Registered Path for Layer
	 * @param {Array<string>} methods Registered request Method for the Layer
	 * @param {Function|Array<Function>} middleware Middlewares to be used in the Layer
	 */
	constructor(path, methods, middleware) {
		this.methods = [];
		this.stack = Array.isArray(middleware) ? middleware : [middleware];
		methods.forEach(function (method) {
			this.methods.push(method.toUpperCase());
		}, this);

		// ensure middleware is a function
		this.stack.forEach(function (fn) {
			let type = typeof fn;
			checkType(
				fn,
				'function',
				true,
				`${methods.toString()} - ${path} - middleware must be a function, not type : ${type}`
			);
		}, this);
		this.path = path;
		this.regex = pathRegex(path);
	}

	/**
	 * Return the result of the match of a given
	 * path to that of the layer
	 * @param {string} path path to be matched
	 * @returns
	 */
	match(path) {
		return this.regex.test(path);
	}

	/**
	 * Set the prefix of the layer's path;
	 * @param {string} prefix
	 * @returns
	 */
	setPrefix(prefix) {
		this.path = prefix + (this.path === '/' ? '' : this.path);
		this.regex = pathRegex(this.path);
		return this;
	}

	/**
	 * Returns the params found on a given request path
	 * @param {string} path
	 * @returns
	 */
	params(path, existingParams) {
		let params = existingParams || {};
		let match = this.regex.exec(path);
		if (match) {
			let captures = { ...match.groups };
			for (let desc in captures) {
				if (!params[desc]) {
					params[desc] = captures[desc];
				}
			}
		}

		return params;
	}
}

module.exports = Layer;
