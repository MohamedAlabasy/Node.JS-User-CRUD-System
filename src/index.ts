import express from 'express';
import 'dotenv/config'
import cors from 'cors';

import notFoundMiddleware from './middleware/notFoundMiddleware';

import routes from './routes/routes';

const app = express();
// #=======================================================================================#
// #			                     add header or use cors                                #
// #=======================================================================================#
app.use(cors());
// #=======================================================================================#
// #			                            router                                         #
// #=======================================================================================#
app.use('', routes);
// #=======================================================================================#
// #			                      not Found middleware                                 #
// #=======================================================================================#
app.use(notFoundMiddleware);

export default app;