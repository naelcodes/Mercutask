const { hashPassword, comparePassword } = require('./dataHash');

module.exports.genRSAKeyPair = require('./keyPairs');
module.exports.hashPassword = hashPassword;
module.exports.comparePassword = comparePassword;
