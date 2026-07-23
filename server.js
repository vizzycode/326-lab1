import express from 'express';
import apiRouter from './routes/api.js';
import pagesRouter from './routes/pages.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.use('/', pagesRouter);
app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// work in progress
