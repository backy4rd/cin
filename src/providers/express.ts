import * as express from 'express';

const app: express.Application = express();

app.use((req, res, next) => {
  req.local = {};
  next();
});

export default app;
