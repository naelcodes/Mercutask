const { promises: pfs, constants } = require('fs');
const path = require('path');

async function createDataModelDir(DatabasePath, dataStoreName) {
	try {
		let _path = path.join(DatabasePath, dataStoreName);
		let isValid = await isDirAccessible(_path);
		if (isValid.access) return { created: true };
		await pfs.mkdir(path.join(DatabasePath, dataStoreName));
		return { created: true, name: dataStoreName, path: _path };
	} catch (err) {
		return Promise.reject({ created: false, err: err.message });
	}
}

async function isDirAccessible(path) {
	let access = false;
	try {
		await pfs.access(path, constants.F_OK | constants.W_OK | constants.R_OK);
		access = true;
		return { access };
	} catch (error) {
		return { access, err: { code: error.code, msg: error.message } };
	}
}

// console.log(date.getDate(), date.getMonth(), date.getFullYear(), data);
async function getDirectory(path) {
	try {
		let dir = await pfs.opendir(path);
		return { dir };
	} catch (err) {
		return { err: err.message };
	}
}

async function getFileEntries(directory) {
	let files = [];
	for await (let dirEntries of directory) {
		if (dirEntries.isFile()) {
			files.push({ name: dirEntries.name, path: path.join(directory.path, dirEntries.name) });
		}
	}
	return files;
}

async function hasFileExceedLimit(filepath, limit = '1b') {
	try {
		let stat = await pfs.stat(filepath);
		let limitInBytes = convertToBytes(limit);
		console.log('size:', stat.size);
		return { isValid: stat.size >= limitInBytes };
	} catch (error) {
		return Promise.reject({ err: error.message });
	}
}

function convertToBytes(size = '1b') {
	let regex = /^(?<fileSize>[1-9]+(?:\.\d{1,2})?)(?<category>(?:b|Kb|Mb|Gb))$/;
	let _size;
	if (!regex.test(size)) {
		throw new Error(`Invalid size, with a given positive integer or float for size, use:
        b for Bytes
        Kb for KiloBytes
        Mb for MegaBytes
        Gb for GigaBytes,
        for float sizes, the size will be fixed to 2 decimal places`);
	}
	let { fileSize, category } = regex.exec(size).groups;

	let s = fileSize.includes('.') ? parseFloat(parseFloat(fileSize).toFixed(2)) : parseInt(fileSize);

	switch (category) {
		case 'b':
			_size = s;
			break;
		case 'Kb':
			_size = s * 1024;
			break;
		case 'Mb':
			_size = s * 1024 * 1024;
			break;
		case 'Gb':
			_size = s * 1024 * 1024 * 1024;
			break;
	}

	return _size;
}

(async () => {
	let result = await createDataModelDir(__dirname, 'user');
	let directory;
	let entries = [];

	if (!result.err) {
		try {
			directory = await getDirectory(path.join(__dirname, 'users'));
			let recordFile;

			if (!directory.err) {
				entries = await getFileEntries(directory.dir);
				console.log(entries);
			}

			for (let file of entries) {
				let exceedLimit = await hasFileExceedLimit(file.path, '14b');
				if (exceedLimit.isValid) {
					console.log('filesize limit reached');
				} else {
					console.log('filesize limit has not been reached');
				}
			}

			// await pfs.writeFile(recordFile, 'hello$\n');
			// await pfs.appendFile(recordFile, 'hello$\n');
			// let data = await pfs.readFile(recordFile, 'utf-8');
			// console.log(stat);
			// console.log(data);
		} catch (err) {
			console.log(err);
		}
	}
})();

class FileDB {
	constructor(path, fileSizeLimit) {
		this.path = path;
		this.fileSizeLimit = fileSizeLimit;
	}
	async model(modelName) {
		let { path, name } = await createDataModelDir(this.path, modelName);
		return new DataModel(path, name, this.path, this.fileSizeLimit);
	}
}

class DataModel {
	constructor(modelPath, name, dbPath, db) {
		this.name = name;
		this.path = modelPath;
	}
}
