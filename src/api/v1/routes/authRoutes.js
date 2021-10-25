// @ts-nocheck

//auth/login
//auth/register
//auth/refresh/token
///auth/forgotten_password/
//auth/reset_password

const Mercuro = require('../../../lib/mercuro');
const Router = new Mercuro.Router();

Router.post('/login', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});
Router.post('/register', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

Router.post('/forgotten_password', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

Router.post('/reset_password', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

module.exports = Router;
