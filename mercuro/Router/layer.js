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
		this.paramNames = [];
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
	params(path) {
		let match = this.regex.exec(path);
		console.log('Layer Path:', this.path);
		console.log('Request path', path);
		console.log('groups-matched:', match);
		let params = match ? match.groups : {};
		return params;
	}


	/**
 * Returns map of URL parameters for given `path` and `paramNames`.
 *
 * @param {String} path
 * @param {Array.<String>} captures
 * @param {Object=} existingParams
 * @returns {Object}
 * @private
 */

params2(path, captures, existingParams) {
  var params = existingParams || {};

  for (var len = captures.length, i=0; i<len; i++) {
    if (this.paramNames[i]) {
      var c = captures[i];
      params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c;
    }
  }

  return params;
};

/**
 * Returns array of regexp url path captures.
 *
 * @param {String} path
 * @returns {Array.<String>}
 * @private
 */

Layer.prototype.captures = function (path) {
  if (this.opts.ignoreCaptures) return [];
  return path.match(this.regexp).slice(1);
};

}

module.exports = Layer;
