import express from 'express';
const app = express();

import { registerMiddlewares } from "./src/middlewares/global.middleware.js";


app.get("/", (req, res) => {
  res.send('Hello World!');
});

registerMiddlewares(app);

export default app;