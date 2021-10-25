const EventEmitter = require('events');

class PubSubLayer {
	static EVENT_STACK = {};
	static EVENT_EMITTER = new EventEmitter();

	/**
	 * Subscribe a listener to an event with name "{@link eventName}"
	 * @param {String} eventName
	 * @param {Function} handler
	 */
	subscribe(eventName, handler) {
		PubSubLayer.EVENT_STACK[eventName] = PubSubLayer.EVENT_STACK[eventName] || [];
		PubSubLayer.EVENT_STACK[eventName].push(handler);
		PubSubLayer.EVENT_STACK[eventName].forEach((listener) => {
			if (!PubSubLayer.EVENT_EMITTER.listeners(eventName).includes(listener)) {
				console.log(
					`THE LISTENER - ${handler.name} - HAS BEEN SUBSCRIBE TO THE EVENT  -${eventName}`
				);
				PubSubLayer.EVENT_EMITTER.on(eventName, listener);
			}
		});
	}

	/**
	 *
	 * Publish an event with name "{@link eventName}" to
	 * their corresponding listeners
	 * @param {String} eventName
	 * @param {Object} data
	 */
	publish(eventName, data) {
		console.log(`AN EVENT - ${eventName} - HAS BEEN PUBLISHED`);
		PubSubLayer.EVENT_EMITTER.emit(eventName, data);
	}

	/**
	 * Unsubscribe a listener to an event with name "{@link eventName}"
	 * @param {String} eventName
	 * @param {Function} handler
	 */
	unsubscribe(eventName, handler) {
		console.log(`THE LISTENER - ${handler.name} - HAS BEEN UNSUBSCRIBE FROM THE EVENT  - ${eventName}`);
		// @ts-ignore
		PubSubLayer.EVENT_EMITTER.removeListener(eventName, handler);
	}
}

module.exports = PubSubLayer;
