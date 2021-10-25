/**
 * @module
 * Module Dependencies
 */
const { checkType } = require('../../../utils');
const bodyJSONParser = require('../../../utils/body-parser');
const compose = require('../compose');
const Layer = require('./layer');

const methods = ['get', 'post', 'put', 'delete']; //

/**
 * Creates A new Router
 * @param {Object=} opts used to set options like prefix
 * @constructor
 */
function Router(opts) {
	if (!(this instanceof Router)) {
		return new Router(opts);
	}
	this.opts = opts || {};
	this.stack = [];
}

/**
 * Use a given middleware(s)
 * @param {string} path path to which
 *  the middleware will be used
 * @param  {Function[]} middlewares list of middlewares
 */
Router.prototype.use = function (path, ...middlewares) {
	let router = this;
	checkType(path, 'string', true, 'Path is required, and must be a string value');

	if (middlewares.length === 0) {
		throw Error('Requires a middleware or a series of middlewares function');
	}
	//support for array of paths
	if (Array.isArray(path)) {
		path.forEach(function (_path) {
			router.use.apply(router, [_path].concat(middlewares));
		});

		return this;
	}

	middlewares.forEach(function (middleware) {
		// @ts-ignore
		if (middleware.router) {
			// @ts-ignore
			middleware.router.stack.forEach(function (nestedLayer) {
				if (path !== '/') {
					nestedLayer.setPrefix(path);
				}
				if (router.opts.prefix) {
					nestedLayer.setPrefix(router.opts.prefix);
				}
				router.stack.push(nestedLayer);
			});
		} else {
			router.register(path, [], middleware);
		}
	});

	return this;
};

/**
 * Dispatches the routes as a  middleware in
 * to mercuro application
 *
 * The routes Layer or middleware layer being dispatched
 * is the composition of the layers that matched the request path
 * and/ method
 * @returns {Function}
 */
Router.prototype.dispatchRoutes = function () {
	let router = this;
	let dispatch = async function dispatch(ctx, next) {
		let path = trimLastSlash(ctx.path);
		let matched = router.match(path, ctx.method);
		if (!matched.route) return next();

		let matchedLayers = matched.pathAndMethod;
		//route should be the last member
		let routeLayer = matchedLayers[matchedLayers.length - 1];
		ctx._matchedRoute = routeLayer.path;
		ctx.params = routeLayer.params(path);
		ctx.body = await bodyJSONParser(ctx.req);

		let layersToCompose = matchedLayers.reduce(
			(layerChain, layer) => layerChain.concat(layer.stack),
			[]
		);

		return compose(layersToCompose)(ctx, next);
	};

	dispatch.router = this;
	return dispatch;
};

/**
 * Return a list of layers that matched with the
 * context path and method
 * @param {string} path Context path
 * @param {string} method Context method
 * @returns {Object} Matched routes and middleware layers
 */
Router.prototype.match = function (path, method) {
	let layers = this.stack;
	let matched = {
		path: [],
		pathAndMethod: [],
		route: false
	};

	for (let layer of layers) {
		if (layer.match(path)) {
			matched.path.push(layer);

			if (layer.methods.length === 0 || layer.methods.includes(method)) {
				matched.pathAndMethod.push(layer);

				//layer is a route
				if (layer.methods.length) {
					matched.route = true;
				}
			}
		}
	}

	return matched;
};

/**
 * Creates and register routes/middleware layers in the router
 * @param {string} path
 * @param {Array<string>} methods
 * @param {Array|Object} middleware
 * @returns {Layer} Registered Layer
 */
Router.prototype.register = function (path, methods, middleware) {
	let stack = this.stack;
	let layer = new Layer(path, methods, middleware);
	if (this.opts.prefix) {
		layer.setPrefix(this.opts.prefix);
	}

	stack.push(layer);
	return layer;
};

/**
 * Set the prefix of the layers in router
 * @param {string} prefix
 * @returns {Router}router instance
 */
Router.prototype.prefix = function (prefix) {
	checkType(prefix, 'string', true, 'Prefix is required, and must be a string value');
	prefix = prefix.replace(/\/$/, '');

	this.opts.prefix = prefix;

	this.stack.forEach(function (route) {
		route.setPrefix(prefix);
	});

	return this;
};

/**
 * Use to register a Layer for all Methods [GET,PUT,POST,DELETE]
 * @param {string} path Request path
 * @param  {...any} middlewares
 * @returns {Router} Router Instance for chaining
 */
Router.prototype.all = function (path, ...middlewares) {
	let router = this;
	checkType(path, 'string', true, 'Path is required, and must be a string value');

	if (middlewares.length === 0) {
		throw Error('Requires a middleware or a series of middlewares function');
	}
	//support for array of paths
	if (Array.isArray(path)) {
		path.forEach(function (_path) {
			router.all.apply(router, [_path].concat(middlewares));
		});

		return this;
	}

	this.register(path, methods, middlewares);
	return this;
};

/**
 * Creates Router#VERBS
 * e.g Router.get(), Router.post(),Router.del(),Router.put()
 */
methods.forEach((method) => {
	Router.prototype[method] = function (path, ...middlewares) {
		checkType(path, 'string', true, 'Path is required, and must be a string value');

		if (middlewares.length === 0) {
			throw Error('Requires a middleware or a series of middlewares function');
		}
		this.register(path, [method], middlewares);
		return this;
	};
});

// Alias for `router.delete()` because delete is a reserved word
Router.prototype.del = Router.prototype['delete'];

function trimLastSlash(path) {
	let lastSlashIndex = path.length - 1;
	let lastSlash = path.lastIndexOf('/') === lastSlashIndex;
	let removed = path.substring(0, path.length - 1);
	return lastSlash ? removed : path;
}
module.exports = Router;
