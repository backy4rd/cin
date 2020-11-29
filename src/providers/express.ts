import * as express from 'express';

import authRoute from '../routes/auth_route';
import moviesRoute from '../routes/movie_route';
import showtimeRoute from '../routes/showtime_route';
import staticRoute from '../routes/static_route';

import * as errorHandler from '../utils/error_handler';

const app: express.Application = express();

app.use((req, res, next) => {
    req.local = {};
    next();
});

app.use('/auth', authRoute);
app.use('/movies', moviesRoute);
app.use('/showtimes', showtimeRoute);

app.use('/static', staticRoute);

app.use(errorHandler.clientErrorHandler);
app.use(errorHandler.serverErrorHandler);

export default app;
