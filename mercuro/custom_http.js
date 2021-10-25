/**
 * Module Dependencies
 */

/**
 * List of http status supported by mercuro
 */
const HTTP_STATUS = {
	200: 'OK',
	201: 'CREATED',
	202: 'ACCEPTED',
	400: 'BAD REQUEST',
	401: 'UNAUTHORIZED',
	403: 'FORBIDDEN',
	404: 'NOT FOUND',
	405: 'METHOD NOT ALLOWED',
	406: 'NOT ACCEPTABLE',
	408: 'REQUEST TIMEOUT',
	500: 'INTERNAL SERVER ERROR',
	501: 'NOT IMPLEMENTED',
	503: 'SERVICE UNAVAILABLE'
};

/**
 * Custom http Error Class
 */
class HttpError extends Error {
	constructor(status, msg, data) {
		super(msg);
		this.status = status;
		this.code = HTTP_STATUS[status];
		this.data = data;
	}
}

/**
 * Creates a custom Http error
 * @param  {...any} args
 * @returns {HttpError} instance of httpError
 */
function createError(...args) {
	let status = 500;
	let message = HTTP_STATUS[status];
	let data = null;
	if (args.length === 0) {
		return new HttpError(status, message);
	}

	if (args.length === 1 && typeof args[0] === 'string') {
		message = args[0];
	}

	if (args.length === 1 && typeof args[0] === 'number') {
		status = args[0];
		message = HTTP_STATUS[status];
	}
	if (args.length === 2) {
		status = Object.keys(HTTP_STATUS).includes(String(args[0])) ? args[0] : status;
		message = args[1];
	}
	if (args.length === 3) {
		status = args[0];
		message = args[1];
		data = args[2];
	}

	return new HttpError(status, message, data);
}

module.exports = { HTTP_STATUS, createError, HttpError };
