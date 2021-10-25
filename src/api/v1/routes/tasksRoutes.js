// @ts-nocheck
const Mercuro = require('../../../lib/mercuro');
const Router = new Mercuro.Router();

Router.get('/:id', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

Router.post('/', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

Router.put('/:id', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

Router.delete('/:id', async (ctx, next) => {
	ctx.status = 200;
	ctx.resBody = {
		method: ctx.method,
		path: ctx.path,
		params: ctx.params
	};
	next();
});

module.exports = Router;
