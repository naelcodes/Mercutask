'use strict';
//regex with two capture groups : duration & id
const regex = /^(?<duration>-?\d+(?:\.\d)?)(?<id>s|m|h|d)$/;

function getMilliseconds(duration) {
	if (typeof duration !== 'string') {
		throw TypeError('Duration must be a string value');
	}
	let info = getDurationInfo(duration);
	if (!info) {
		throw Error(`
        The duration - ${duration} - specified is invalid, use a number followed by:  
            s  for seconds
            m  for minutes
            h  for hours
            d  for days

    `);
	}

	let milliseconds;
	let parseDuration = info.duration.includes('.') ? parseFloat(info.duration) : parseInt(info.duration);
	switch (info.id) {
		case 's':
			milliseconds = parseDuration * 1000;
			break;
		case 'm':
			milliseconds = parseDuration * 60 * 1000;
			break;
		case 'h':
			milliseconds = parseDuration * 60 * 60 * 1000;
			break;
		case 'd':
			milliseconds = parseDuration * 24 * 60 * 60 * 1000;
			break;
	}

	return milliseconds;
}

function getDurationInfo(duration) {
	let info;
	if (regex.test(duration)) {
		info = { ...regex.exec(duration).groups };
	}
	return info;
}

module.exports = getMilliseconds;
