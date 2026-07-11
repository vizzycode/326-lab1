import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello, web!');
});

router.get('/hello', (req, res) => {
  res.send('I am learning how Express routes turn browser requests into web server responses.');
});

router.get('/about', (req, res) => {
  res.send('This is a web programming course.');
});

router.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello, ${name}!`);
});

router.get('/repeat/:word', (req, res) => {
  const { word } = req.params;
  res.send(`${word} ${word} ${word}`);
});

router.get('/count', (req, res) => {
  const from = req.query.from || '1';
  const to = req.query.to || '10';
  res.send(`Counting from ${from} to ${to}.`);
});

export default router;
