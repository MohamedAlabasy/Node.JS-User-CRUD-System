import express from 'express';
import 'dotenv/config'

import notFoundMiddleware from './middleware/notFoundMiddleware';

import routes from './routes/routes';

const app = express();
// #=======================================================================================#
// #			                            router                                         #
// #=======================================================================================#
app.use('', routes);
// #=======================================================================================#
// #			                      not Found middleware                                 #
// #=======================================================================================#
app.use(notFoundMiddleware);

export default app;