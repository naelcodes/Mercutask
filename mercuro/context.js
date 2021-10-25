/**
 * Module Dependencies
 */
const { mix } = require('../../utils');
const { createError, HttpError, HTTP_STATUS } = require('./custom_http');
const request = require('./request');
const response = require('./response');

/**
 * Class used to create a context that will
 * encapsulate the request and response
 */
class Context {
	constructor(req, res, app) {
		this.app = app;
		this.req = req;
		this.res = res;
		this.#createContext();
	}

	/**
	 * clones the custom request and response prototype
	 * in the given context instance
	 */
	#createContext() {
		mix(request, response).in(this);
	}

	/**
	 * Throws a HttpError with the given arguments
	 * @param  {...any} args
	 */
	throw(...args) {
		throw createError(...args);
	}

	/**
	 * Context Error handler
	 * @param {Object} err Error thrown in application
	 */
	onerror(err) {
		let formattedMsg = { status: 'error', message: HTTP_STATUS['500'], data: {} };
		const isHttpError = err instanceof HttpError;
		// @ts-ignore
		this.app.emit('error', err, this);
		this.status = isHttpError ? err.status : 500;
		// @ts-ignore
		this.removeHeaders();
		// @ts-ignore
		this.set('Content-Type', 'application/json');
		formattedMsg.message = isHttpError ? err.message : formattedMsg.message;
		formattedMsg.data = err?.data ? err.data : formattedMsg.data;

		// @ts-ignore
		this.end(JSON.stringify(formattedMsg));
	}
}

module.exports = Context;
