# Express.js Interview Notes for Freshers

> A quick, interview-focused guide: concepts, code, and the most-asked questions with answers.

---

## Table of Contents

1. [What is Express.js?](#1-what-is-expressjs)
2. [Setup & First Server](#2-setup--first-server)
3. [Routing](#3-routing)
4. [Request & Response Objects](#4-request--response-objects)
5. [Middleware (Most Important Topic)](#5-middleware-most-important-topic)
6. [Built-in & Common Third-Party Middleware](#6-built-in--common-third-party-middleware)
7. [Express Router (Modular Routes)](#7-express-router-modular-routes)
8. [Error Handling](#8-error-handling)
9. [REST API & HTTP Concepts](#9-rest-api--http-concepts)
10. [Connecting to MongoDB (Mongoose CRUD)](#10-connecting-to-mongodb-mongoose-crud)
11. [Authentication with JWT](#11-authentication-with-jwt)
12. [Environment Variables & Config](#12-environment-variables--config)
13. [Security Best Practices](#13-security-best-practices)
14. [Project Structure (MVC)](#14-project-structure-mvc)
15. [Template Engines & Static Files](#15-template-engines--static-files)
16. [Async/Await & Promises in Express](#16-asyncawait--promises-in-express)
17. [Interview Questions & Answers](#17-interview-questions--answers)
18. [Coding Questions Asked in Interviews](#18-coding-questions-asked-in-interviews)
19. [Cheat Sheet](#19-cheat-sheet)

---

## 1. What is Express.js?

- **Express.js** is a minimal, fast, unopinionated **web framework for Node.js**.
- It sits on top of Node's built-in `http` module and makes building servers and APIs much easier.
- Used for building **REST APIs**, **web apps**, and **microservices**.
- Part of the **MEAN / MERN** stack (MongoDB, Express, Angular/React, Node).

### Why use Express?

| Feature | Benefit |
|---|---|
| Simple routing | Handle URLs and HTTP methods easily |
| Middleware support | Reusable functions for auth, logging, parsing, etc. |
| Template engines | Render dynamic HTML (EJS, Pug, Handlebars) |
| Huge ecosystem | Thousands of npm packages |
| Lightweight | Minimal overhead, fast performance |
| Unopinionated | You decide the project structure |

### Node.js vs Express.js

| Node.js | Express.js |
|---|---|
| JavaScript **runtime** | **Framework** built on Node.js |
| Lots of boilerplate for routing/parsing | Simple routing and middleware |
| Uses built-in `http` module | Wraps `http` with helpful APIs |

---

## 2. Setup & First Server

```bash
mkdir my-app && cd my-app
npm init -y
npm install express
npm install --save-dev nodemon     # auto-restarts server on file change
```

**`app.js`**

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**`package.json` scripts**

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

### ES Modules version

Add `"type": "module"` in `package.json`:

```js
import express from 'express';
const app = express();
```

---

## 3. Routing

Routing = deciding **how the app responds** to a client request for a specific **URL (path)** and **HTTP method**.

**Syntax:** `app.METHOD(PATH, HANDLER)`

```js
app.get('/users', (req, res) => res.send('Get all users'));
app.post('/users', (req, res) => res.send('Create user'));
app.put('/users/:id', (req, res) => res.send('Update user'));
app.patch('/users/:id', (req, res) => res.send('Partially update user'));
app.delete('/users/:id', (req, res) => res.send('Delete user'));
app.all('/secret', (req, res) => res.send('Any HTTP method'));
```

### Route Parameters (`req.params`)

```js
// URL: /users/42
app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);   // "42"
});
```

### Query Strings (`req.query`)

```js
// URL: /search?name=john&age=25
app.get('/search', (req, res) => {
  const { name, age } = req.query;
  res.json({ name, age });
});
```

### Request Body (`req.body`)

```js
app.use(express.json());   // required to parse JSON body

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ message: 'User created', name, email });
});
```

### Route Chaining with `app.route()`

```js
app.route('/books')
  .get((req, res) => res.send('Get all books'))
  .post((req, res) => res.send('Add a book'));
```

### Route Order Matters

Express matches routes **top to bottom**. Put specific routes before generic ones, and the 404 handler at the end.

```js
app.get('/users/new', ...);   // specific first
app.get('/users/:id', ...);   // generic after
```

---

## 4. Request & Response Objects

### `req` (Request) – Common Properties

| Property | Description |
|---|---|
| `req.params` | Route parameters (`/users/:id`) |
| `req.query` | Query string (`?key=value`) |
| `req.body` | Request body (needs body-parser middleware) |
| `req.headers` | HTTP headers |
| `req.cookies` | Cookies (needs `cookie-parser`) |
| `req.method` | HTTP method (GET, POST...) |
| `req.url` / `req.originalUrl` | Request URL |
| `req.path` | Path part of the URL |
| `req.ip` | Client IP address |
| `req.get('Header-Name')` | Get a specific header |

### `res` (Response) – Common Methods

| Method | Description |
|---|---|
| `res.send()` | Send a response (string, object, buffer) |
| `res.json()` | Send JSON response |
| `res.status(code)` | Set HTTP status code (chainable) |
| `res.sendStatus(code)` | Set status and send its text |
| `res.redirect(url)` | Redirect to another URL |
| `res.render(view, data)` | Render a template |
| `res.sendFile(path)` | Send a file |
| `res.download(path)` | Prompt file download |
| `res.cookie(name, value)` | Set a cookie |
| `res.set(header, value)` | Set a header |
| `res.end()` | End response without data |

```js
res.status(404).json({ error: 'Not found' });
```

### `res.send()` vs `res.json()` vs `res.end()`

- `res.send()` – auto-detects the type (string, object, buffer) and sets Content-Type.
- `res.json()` – converts data to JSON and sets `Content-Type: application/json`.
- `res.end()` – ends the response with no data; used mainly for low-level control.

> **Note:** You can send **only one response** per request. Sending twice causes the error `Cannot set headers after they are sent to the client`.

---

## 5. Middleware (Most Important Topic)

### Definition

**Middleware** functions have access to `req`, `res`, and the `next` function. They run **between** the request arriving and the response being sent.

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

### What can middleware do?

- Execute any code
- Modify `req` and `res`
- End the request-response cycle
- Call the next middleware using `next()`

### Syntax

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();   // pass control to the next middleware
};

app.use(logger);
```

> If you **don't call `next()`** and **don't send a response**, the request will **hang** forever.

### Types of Middleware

| Type | Example |
|---|---|
| **Application-level** | `app.use(logger)` |
| **Router-level** | `router.use(authCheck)` |
| **Built-in** | `express.json()`, `express.static()` |
| **Third-party** | `cors`, `helmet`, `morgan`, `cookie-parser` |
| **Error-handling** | `(err, req, res, next) => {}` – has **4 params** |

### Route-specific Middleware

```js
const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

app.get('/profile', auth, (req, res) => {
  res.send('Protected profile');
});
```

### Multiple Middleware on One Route

```js
app.get('/admin', auth, isAdmin, (req, res) => res.send('Admin panel'));
```

### Order of Middleware

Middleware runs in the **order it is defined**. So `express.json()` must be placed **before** routes that read `req.body`.

---

## 6. Built-in & Common Third-Party Middleware

### Built-in

```js
app.use(express.json());                          // parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // parse form data
app.use(express.static('public'));                // serve static files
```

### Third-party (install via npm)

| Package | Purpose |
|---|---|
| `cors` | Enable Cross-Origin Resource Sharing |
| `helmet` | Set secure HTTP headers |
| `morgan` | HTTP request logger |
| `cookie-parser` | Parse cookies |
| `dotenv` | Load environment variables |
| `express-rate-limit` | Limit repeated requests (prevent brute force) |
| `multer` | Handle file uploads (`multipart/form-data`) |
| `compression` | Gzip compress responses |
| `express-validator` / `joi` | Input validation |

```js
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
```

### `express.json()` vs `express.urlencoded()`

| `express.json()` | `express.urlencoded()` |
|---|---|
| Parses `application/json` | Parses `application/x-www-form-urlencoded` (HTML forms) |
| Used for APIs | Used for form submissions |

---

## 7. Express Router (Modular Routes)

`express.Router()` creates **modular, mountable route handlers** so that `app.js` doesn't become huge.

**`routes/userRoutes.js`**

```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('All users'));
router.get('/:id', (req, res) => res.send(`User ${req.params.id}`));
router.post('/', (req, res) => res.send('Create user'));

module.exports = router;
```

**`app.js`**

```js
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
```

Now the URLs become `/api/users`, `/api/users/:id`, etc.

---

## 8. Error Handling

### Error-handling middleware has **4 parameters**

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
```

> It must be defined **after** all routes and other middleware.

### 404 Handler (Route Not Found)

```js
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});
```

### Passing errors with `next(err)`

```js
app.get('/user/:id', (req, res, next) => {
  const user = null;
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    return next(error);   // jumps to error-handling middleware
  }
  res.json(user);
});
```

### Handling Errors in Async Code

In **Express 4**, errors thrown inside `async` functions are **not** caught automatically. You must use `try/catch` and call `next(err)`:

```js
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});
```

**Reusable wrapper (asyncHandler):**

```js
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));
```

> **Express 5** handles rejected promises from async handlers automatically.

---

## 9. REST API & HTTP Concepts

### REST

**REST (Representational State Transfer)** is an architectural style for designing APIs using HTTP methods and resource-based URLs.

### CRUD ↔ HTTP Methods

| Operation | HTTP Method | Example URL |
|---|---|---|
| Create | `POST` | `/api/users` |
| Read (all) | `GET` | `/api/users` |
| Read (one) | `GET` | `/api/users/:id` |
| Update (full) | `PUT` | `/api/users/:id` |
| Update (partial) | `PATCH` | `/api/users/:id` |
| Delete | `DELETE` | `/api/users/:id` |

### PUT vs PATCH

- **PUT** – replaces the **entire** resource.
- **PATCH** – updates only the **specified fields**.

### Common HTTP Status Codes

| Code | Meaning | When to use |
|---|---|---|
| `200` | OK | Successful GET/PUT/PATCH |
| `201` | Created | Successful POST (resource created) |
| `204` | No Content | Successful DELETE (no body) |
| `301/302` | Redirect | Permanent / temporary redirect |
| `400` | Bad Request | Invalid input |
| `401` | Unauthorized | Not logged in / invalid token |
| `403` | Forbidden | Logged in but no permission |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource (e.g., email exists) |
| `422` | Unprocessable Entity | Validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side bug |

### Idempotent Methods

A method is **idempotent** if repeating the same request gives the same result: `GET`, `PUT`, `DELETE` are idempotent. `POST` is **not**.

---

## 10. Connecting to MongoDB (Mongoose CRUD)

```bash
npm install mongoose
```

**Connect**

```js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));
```

**Model – `models/User.js`**

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age:   { type: Number, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

**Controller / Routes – Full CRUD**

```js
const User = require('../models/User');

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
});

// READ ALL
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) { next(err); }
});

// READ ONE
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,            // return updated document
      runValidators: true   // run schema validation
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});
```

---

## 11. Authentication with JWT

```bash
npm install jsonwebtoken bcryptjs
```

### Flow

1. User **registers** → password is **hashed** using bcrypt → saved in DB.
2. User **logs in** → password compared → server issues a **JWT**.
3. Client sends JWT in `Authorization: Bearer <token>` header for protected routes.
4. **Auth middleware** verifies the token.

### Register

```js
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);   // 10 salt rounds
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) { next(err); }
});
```

### Login

```js
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ token });
  } catch (err) { next(err); }
});
```

### Auth Middleware

```js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

router.get('/profile', protect, (req, res) => res.json({ userId: req.user.id }));
```

### JWT Structure

`header.payload.signature` – three Base64URL-encoded parts separated by dots.

### Sessions vs JWT

| Session | JWT |
|---|---|
| Stored on **server** | Stored on **client** (stateless) |
| Uses session ID cookie | Uses signed token |
| Harder to scale horizontally | Easy to scale |
| Easy to revoke | Harder to revoke before expiry |

---

## 12. Environment Variables & Config

```bash
npm install dotenv
```

**`.env`** (never commit this file!)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=supersecretkey
NODE_ENV=development
```

```js
require('dotenv').config();
const PORT = process.env.PORT || 3000;
```

- Add `.env` to **`.gitignore`**.
- Provide a `.env.example` for teammates.

---

## 13. Security Best Practices

| Practice | How |
|---|---|
| Secure headers | `helmet()` |
| Enable CORS carefully | `cors({ origin: 'https://myapp.com' })` |
| Rate limiting | `express-rate-limit` |
| Hash passwords | `bcrypt` |
| Validate & sanitize input | `joi`, `express-validator` |
| Prevent NoSQL injection | `express-mongo-sanitize` |
| Prevent XSS | Sanitize input, escape output |
| Use HTTPS | In production |
| Keep secrets in env | `dotenv` |
| Limit body size | `express.json({ limit: '10kb' })` |
| Update dependencies | `npm audit` |
| Hide tech stack | `app.disable('x-powered-by')` (helmet does this) |

**Rate limiter example**

```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,                   // 100 requests per IP
  message: 'Too many requests, try again later.'
});

app.use('/api', limiter);
```

### What is CORS?

**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that blocks requests from a different **origin** (domain/port/protocol) unless the server allows it via headers like `Access-Control-Allow-Origin`.

---

## 14. Project Structure (MVC)

```
project/
├── config/
│   └── db.js
├── controllers/
│   └── userController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   └── User.js
├── routes/
│   └── userRoutes.js
├── utils/
│   └── asyncHandler.js
├── .env
├── .gitignore
├── app.js          # express app setup
├── server.js       # starts the server
└── package.json
```

### MVC Pattern

- **Model** – data structure & DB logic (Mongoose schemas).
- **View** – what the user sees (templates / JSON response).
- **Controller** – business logic that handles requests.

**Controller example**

```js
// controllers/userController.js
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) { next(err); }
};

// routes/userRoutes.js
router.get('/', getUsers);
```

> Tip: Separate `app.js` (app config) and `server.js` (`app.listen`) to make testing easier.

---

## 15. Template Engines & Static Files

### Static Files

```js
app.use(express.static('public'));
// public/style.css → http://localhost:3000/style.css

app.use('/static', express.static('public'));
// → http://localhost:3000/static/style.css
```

### Template Engine (EJS)

```bash
npm install ejs
```

```js
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', name: 'John' });
});
```

**`views/index.ejs`**

```html
<h1><%= title %></h1>
<p>Hello, <%= name %></p>
```

Popular engines: **EJS**, **Pug**, **Handlebars**.

---

## 16. Async/Await & Promises in Express

Node.js is **single-threaded** and **non-blocking**. Use async patterns for DB calls, file reads, and API calls.

```js
// Callback (old, leads to callback hell)
fs.readFile('a.txt', (err, data) => { ... });

// Promise
fetchUser().then(user => ...).catch(err => ...);

// Async/Await (modern, preferred)
const user = await fetchUser();
```

> Always **avoid blocking the event loop** (heavy loops, `fs.readFileSync` in routes, etc.).

---

## 17. Interview Questions & Answers

### Basic Level

**Q1. What is Express.js?**
A minimal and flexible Node.js web framework that provides features for building web and mobile applications and APIs, such as routing, middleware, and template support.

**Q2. How is Express different from Node.js?**
Node.js is the JavaScript runtime; Express is a framework built on top of it that simplifies routing, middleware handling, and request/response management.

**Q3. How do you create a basic Express server?**
Import express, create an app with `express()`, define routes, and call `app.listen(port)`.

**Q4. What is middleware?**
A function with access to `req`, `res`, and `next` that executes during the request-response cycle. It can modify the request/response, end the cycle, or pass control using `next()`.

**Q5. What does `next()` do?**
It passes control to the next middleware or route handler. If called with an argument (`next(err)`), Express skips to the error-handling middleware.

**Q6. What is the difference between `app.use()` and `app.get()`?**
`app.use()` applies middleware to **all HTTP methods** and matches any path that **starts with** the given path. `app.get()` handles only **GET** requests with an **exact** path match.

**Q7. What are route parameters and query parameters?**
Route params are part of the URL path (`/users/:id` → `req.params.id`). Query params come after `?` (`/users?role=admin` → `req.query.role`).

**Q8. How do you read data from a POST request body?**
Use `express.json()` (and/or `express.urlencoded()`) middleware, then access `req.body`.

**Q9. What is the difference between `res.send()` and `res.json()`?**
`res.send()` accepts many types and sets the content type accordingly; `res.json()` always converts to JSON and sets `Content-Type: application/json`.

**Q10. What is `express.Router()`?**
A mini-app for creating modular, mountable route handlers, keeping code organized.

### Intermediate Level

**Q11. How do you handle errors in Express?**
Using an error-handling middleware with four parameters `(err, req, res, next)` defined after all routes. Errors are passed via `next(err)`.

**Q12. What are the types of middleware?**
Application-level, router-level, built-in, third-party, and error-handling middleware.

**Q13. What is CORS and how do you enable it?**
A browser security feature that restricts cross-origin requests. Enable it with the `cors` package: `app.use(cors())`.

**Q14. How do you serve static files?**
`app.use(express.static('public'))`.

**Q15. What is the difference between PUT and PATCH?**
PUT replaces the entire resource; PATCH updates only specific fields.

**Q16. What is the difference between authentication and authorization?**
Authentication verifies **who you are** (login). Authorization verifies **what you can access** (roles/permissions).

**Q17. How do you secure an Express application?**
Use Helmet, CORS configuration, rate limiting, input validation, password hashing, HTTPS, environment variables for secrets, and keep dependencies updated.

**Q18. How do you handle file uploads?**
Using the `multer` middleware for `multipart/form-data`.

```js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => res.send('Uploaded'));
```

**Q19. What is `process.env`?**
An object containing environment variables. Used with `dotenv` to keep config and secrets out of the code.

**Q20. What is the difference between `app.listen()` and `http.createServer()`?**
`app.listen()` is a convenience method that internally calls `http.createServer(app).listen()`.

### Advanced / Tricky Level

**Q21. What is the order of execution in middleware?**
Middleware executes in the order it is defined in the code. That's why parsers and logging come first, routes next, then 404 and error handlers last.

**Q22. What happens if you don't call `next()`?**
The request hangs, unless a response is sent from that middleware.

**Q23. Why do we get "Cannot set headers after they are sent to the client"?**
Because the code tries to send more than one response for a single request (e.g., missing `return` after `res.send()`).

**Q24. What is the event loop?**
The mechanism that lets Node.js handle many async operations on a single thread by offloading tasks and processing their callbacks when ready.

**Q25. What is the difference between `process.nextTick()` and `setImmediate()`?**
`nextTick` callbacks run **before** the event loop continues (end of current operation); `setImmediate` runs in the **check phase** of the next loop iteration.

**Q26. How do you scale an Express application?**
Use clustering / PM2, load balancers (Nginx), caching (Redis), database indexing, horizontal scaling, and avoid blocking operations.

**Q27. How do you implement rate limiting?**
Use `express-rate-limit` to limit the number of requests per IP in a time window.

**Q28. What is the difference between `req.params`, `req.query`, and `req.body`?**
URL path variables, URL query string, and request payload respectively.

**Q29. What is `app.set()` / `app.get()` (settings)?**
`app.set(name, value)` sets app-level settings (e.g., view engine); `app.get(name)` retrieves them.

**Q30. How do you handle 404 errors?**
Add a catch-all middleware at the very end: `app.use((req, res) => res.status(404).json({ message: 'Not found' }))`.

**Q31. What is the difference between `app.use()` and `router.use()`?**
`app.use()` applies to the whole application; `router.use()` applies only to that router's routes.

**Q32. How do you do API versioning?**
Prefix routes: `app.use('/api/v1/users', v1Routes)` and `app.use('/api/v2/users', v2Routes)`.

**Q33. What is PM2?**
A production process manager for Node.js that keeps apps alive, restarts on crash, enables clustering, and manages logs.

**Q34. What is body-parser? Is it still needed?**
It parses request bodies. Since Express 4.16+, `express.json()` and `express.urlencoded()` are built in, so a separate install is not required.

**Q35. Name some alternatives to Express.**
Fastify, Koa, NestJS, Hapi.

---

## 18. Coding Questions Asked in Interviews

### 1. Create a basic CRUD API (in-memory)

```js
const express = require('express');
const app = express();
app.use(express.json());

let todos = [];
let id = 1;

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const todo = { id: id++, title: req.body.title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === +req.params.id);
  if (!todo) return res.status(404).json({ message: 'Not found' });
  Object.assign(todo, req.body);
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== +req.params.id);
  res.status(204).send();
});

app.listen(3000);
```

### 2. Write a custom logger middleware

```js
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
};
app.use(logger);
```

### 3. Role-based authorization middleware

```js
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

app.delete('/users/:id', protect, authorize('admin'), deleteUser);
```

### 4. Pagination

```js
// GET /users?page=2&limit=10
app.get('/users', async (req, res) => {
  const page  = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip  = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit);
  const total = await User.countDocuments();

  res.json({ page, limit, total, pages: Math.ceil(total / limit), data: users });
});
```

### 5. Centralized error handler with custom error class

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// usage
throw new AppError('User not found', 404);

// handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});
```

### 6. Validate input with Joi

```js
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required()
});

const validate = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

app.post('/users', validate, createUser);
```

---

## 19. Cheat Sheet

```js
// Setup
const express = require('express');
const app = express();

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler (last)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(process.env.PORT || 3000);
```

### Must-Remember Points

- Express = framework on top of Node.js `http` module.
- **Middleware** = functions with `(req, res, next)`; order matters.
- Error middleware has **4 params** `(err, req, res, next)` and goes **last**.
- Use `express.json()` to read `req.body`.
- `req.params` → path, `req.query` → `?key=value`, `req.body` → payload.
- Always use `try/catch` (or an async wrapper) with `async` routes in Express 4.
- Use `express.Router()` for modular code.
- Hash passwords with **bcrypt**, authenticate with **JWT**.
- Keep secrets in `.env`, add it to `.gitignore`.
- Secure with **helmet**, **cors**, **rate limiting**, **validation**.
- Send **one response per request**; use `return` to avoid double responses.

---

### Final Interview Tips

1. **Explain with examples** – write a small code snippet when you answer.
2. **Know middleware deeply** – it is the most-asked Express topic.
3. **Build one small project** (Todo API / Blog API with auth) and be ready to explain every file.
4. **Know the basics of Node.js** – event loop, async/await, modules, npm.
5. **Be honest** – if you don't know something, say how you'd find out.

*Good luck with your interview!* 🚀
