# Hello Web

Unit 02 Express routes and responses server for the web design course.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Routes

- `GET /` responds with a greeting.
- `GET /hello` responds with a sentence about the course.
- `GET /about` responds with the course description from the Real World example.
- `GET /hello/:name` responds with a personalized greeting.
- `GET /repeat/:word` repeats a URL parameter three times.
- `GET /count` reads optional `from` and `to` query parameters.
- `GET /api/info` responds with JSON application information.
- `GET /api/error` responds with HTTP 400 and `Bad request.`
- `GET /api/status` responds with JSON containing `status` and `uptime`.
- Any unknown path responds with `Page not found.` and HTTP 404.

## Test

```bash
npm test
```
