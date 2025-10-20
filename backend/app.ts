import express from 'express';
const app = express();

app.get("/", (req, res) => {
  res.send('Hello World!');
});

app.listen(3001, () => console.log('Running on 3001'));

export default app;