const http = require('http');
const { port } = require('./src/config');
const app = require('./src/app');

// @ts-ignore
const server = http.createServer(app.dispatch());

server.listen(port, () => {
	console.log(`SERVER RUNNING ON PORT : ${port}`);
});
