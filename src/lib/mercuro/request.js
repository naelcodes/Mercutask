'use strict';

/**
 * Module Dependencies
 */
const url = require('url');

/**
 * Request Prototype
 */

const proto = {
	get query() {
		return url.parse(this.req.url, true).query;
	},

	/**
	 * Return a request Header
	 * @param {String} field Header Name
	 *
	 */
	get(field) {
		return this.req.headers[field.toLowerCase()] || '';
	},

	/**
	 * Return request url
	 * e.g /users/1/comments?search
	 */
	get path() {
		return this.req.url;
	},

	/**
	 * Return request pathname
	 * e.g /user/1/comments
	 */
	get pathname() {
		return url.parse(this.req.url, true).pathname;
	},

	/**
	 * Return the request method
	 */
	get method() {
		return this.req.method;
	}
};

module.exports = proto;
