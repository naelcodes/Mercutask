/**
 * create a regular expression from the given path
 * @param {String} path
 * @returns {RegExp} regex
 */
function pathRegex(path) {
	if (typeof path !== 'string') {
		throw TypeError(`Requires path to be a string but got type - ${typeof path}`);
	}

	let strRegex = '';

	for (let i = 0; i < path.length; i++) {
		let c = path.charAt(i);

		if (c === ':' || c === '?') {
			let param = '';
			let query = '';
			let j;
			let namedCaptureGroup = '';

			//if Params
			if (c === ':') {
				for (j = i + 1; j < path.length; j++) {
					if (/\w/.test(path.charAt(j)) && path.charAt(j) !== '?') {
						param += path.charAt(j);
					} else break;
				}
				namedCaptureGroup = `(?<${param}>\\d+)`;
				i = j - 1;
				strRegex += namedCaptureGroup;
			}

			//if query
			if (c === '?') {
				for (j = i + 1; j < path.length; j++) {
					if (/\S/.test(path.charAt(j))) {
						query += path.charAt(j);
					} else break;
				}

				namedCaptureGroup = query === '' ? `\\?(?<query>\\S+)` : `\\?(?<${query}>\\S+)`;
				i = j - 1;
				strRegex += namedCaptureGroup;
			}
		} else {
			strRegex += c;
		}
	}
	strRegex += '$';
	return RegExp(strRegex);
}
module.exports = pathRegex;
