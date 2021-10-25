/**
 * Module Dependencies
 * @private
 */

let EventEmitter = require('events');
let http = require('http');
const { mix } = require('../../utils');
const compose = require('./compose');
const Context = require('./context');
const context = require('./context');
const Request = require('./request');
const Response = require('./response');

/**
 * Create a  Mercuro Application
 */

class Application extends EventEmitter {
	#middlewares;

	/**
	 * Use to Initialize a New Application
	 * @api public
	 */
	constructor() {
		super();
		this.#middlewares = [];
	}

	/**
	 * Use a given middleware
	 * @param {Function} fn
	 * @returns {Application} Application instance
	 *
	 * @api public
	 */
	use(fn) {
		if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
		this.#middlewares.push(fn);
		return this;
	}

	/**
	 * Returns a request handler for node Http server
	 * @returns {Function} Request handler
	 *
	 * @api public
	 */
	dispatch() {
		const composedMiddleware = compose(this.#middlewares);

		if (!this.listenerCount('error')) this.on('error', this.#onerror);

		const handleRequest = (req, res) => {
			let ctx = new Context(req, res, this);
			return this.#handleRequest(ctx, composedMiddleware);
		};
		return handleRequest;
	}

	/**
	 * Create a Http server which listens to the arguments passed in args
	 * @param  {...any} args
	 */

	listen(...args) {
		// @ts-ignore
		let server = http.createServer(this.dispatch());
		server.listen(...args);
	}

	/**
	 *  Handles the request in dispatcher
	 * @param {Object} ctx Context Object
	 * @param {Function} composedMiddleware
	 *
	 * @api private
	 */
	#handleRequest(ctx, composedMiddleware) {
		const onerror = (err) => ctx.onerror(err);
		const handleResponse = () => this.#responseHandler(ctx);
		return composedMiddleware(ctx).then(handleResponse).catch(onerror);
	}

	/**
	 * Create a context object that encapsulate and extends node
	 * native request and response object
	 * @param {http.IncomingMessage} req Node native request object
	 * @param {http.ServerResponse} res  Node native response object
	 * @returns {Object} Application Context Object
	 *
	 * @api private
	 */
	#createContext(req, res) {}

	/**
	 * Handle the application response
	 * @param {Object} ctx Context Object
	 *
	 * @api private
	 */
	#responseHandler(ctx) {
		let content;
		if (!ctx._matchedRoute) {
			ctx.status = 404;
			content = { status: 'error', message: `${ctx.method}:${ctx.path}- NOT FOUND` };
		} else {
			content = ctx.resBody || '';
		}
		ctx.set('Content-Type', 'application/json');
		if (typeof content === 'string') {
			ctx.end(content);
		} else if (typeof content === 'object') {
			ctx.end(JSON.stringify(content));
		}
	}

	/**
	 * Handles uncatched app errors
	 * @param {Error|Object} err Error object
	 * @api private
	 */
	#onerror(err) {
		let name = err.name;
		let stack = err.stack;
		let message = err.message;

		console.error({ name, message, stack });
	}
}

module.exports = Application;
