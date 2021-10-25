const { apiMainRouterPath } = require('../config');
const Mercuro = require('../lib/mercuro');

const userRouter = require('../api/v1/routes/userRoutes');
const authRouter = require('../api/v1/routes/authRoutes');
const taskRouter = require('../api/v1/routes/tasksRoutes');
const apiRouter = new Mercuro.Router({ prefix: apiMainRouterPath });

const app = new Mercuro();

apiRouter.use('/auth', authRouter.dispatchRoutes());
apiRouter.use('/users', userRouter.dispatchRoutes());
apiRouter.use('/tasks', taskRouter.dispatchRoutes());

app.use(apiRouter.dispatchRoutes());

module.exports = app;
