'use strict';

/**
 * Compose a series of middlewares in to a single function, which
 * calls the middleware sequentially
 * @param {Array<Function>} middlewares
 * @returns {Function} Function
 */
function compose(middlewares) {
	if (!Array.isArray(middlewares)) throw new TypeError('Middleware stack must be an array!');
	for (const fn of middlewares) {
		if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
	}

	/**
	 * Composed Function that will handle the apps context and middlewares
	 * @param {Object} context app context
	 * @param {any} next link to next middleware in app
	 * @return {Promise}
	 *
	 */
	return function (context, next) {
		let lastCalledIndex = -1;
		return createNext(0);

		function createNext(index) {
			if (index <= lastCalledIndex) return Promise.reject(new Error('next() called multiple times'));

			let currentMiddleware = middlewares[index];
			//if there are no more middlewares
			if (index === middlewares.length) {
				currentMiddleware = next;
			}

			if (!currentMiddleware) return Promise.resolve();
			try {
				return Promise.resolve(currentMiddleware(context, createNext.bind(null, index + 1)));
			} catch (err) {
				return Promise.reject(err);
			}
		}
	};
}

module.exports = compose;
