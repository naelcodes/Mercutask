'use strict';
/**
 * Module dependencies
 */
const { checkType } = require('../../utils');

/**
 * Response prototype
 */
const proto = {
	/**
	 * Getter - reads the response body
	 * @name resBody : body of the outgoing response
	 *
	 */
	get resBody() {
		return this._body;
	},

	/**
	 * Setter - set the response body
	 */
	set resBody(data) {
		this._body = data;
	},

	/**
	 * Getter - gets the Response Status code
	 *  @name status Response Status Code
	 */
	get status() {
		return this.res.statusCode;
	},

	/**
	 * Setter - sets the response status code
	 */
	set status(statusCode) {
		checkType(statusCode, 'number', true, 'Status Code must be a number ');
		this.res.statusCode = statusCode;
	},

	/**
	 * Set the header of the Response
	 * @param {String} header
	 * @param {String} value
	 */
	set(header, value) {
		checkType([header, value], 'string', true, 'set(header,value) requires String values');
		this.res.setHeader(header, value);
	},

	/**
	 * Terminates the request, by sending the Response
	 * @param {String} body
	 */
	end(body) {
		this.res.end(body);
	},

	/**
	 * Deletes all the header in Response
	 */
	removeHeaders() {
		this.res.getHeaderNames().forEach((name) => this.res.removeHeader(name));
	}
};

module.exports = proto;
