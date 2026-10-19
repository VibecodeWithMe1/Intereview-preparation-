# Node.js Interview Notes for Freshers

> A quick, interview-focused guide: core concepts, code examples, and the most-asked questions with answers.

---

## Table of Contents

1. [What is Node.js?](#1-what-is-nodejs)
2. [Architecture: V8, libuv & Event Loop](#2-architecture-v8-libuv--event-loop)
3. [Setup, npm & package.json](#3-setup-npm--packagejson)
4. [Modules (CommonJS vs ES Modules)](#4-modules-commonjs-vs-es-modules)
5. [Core Modules](#5-core-modules)
6. [Asynchronous Programming](#6-asynchronous-programming)
7. [Event Loop Phases (Deep Dive)](#7-event-loop-phases-deep-dive)
8. [EventEmitter](#8-eventemitter)
9. [File System (fs)](#9-file-system-fs)
10. [Streams & Buffers](#10-streams--buffers)
11. [Creating an HTTP Server](#11-creating-an-http-server)
12. [Error Handling](#12-error-handling)
13. [Global Objects & process](#13-global-objects--process)
14. [Scaling: Cluster, Worker Threads, Child Process](#14-scaling-cluster-worker-threads-child-process)
15. [Environment Variables & Config](#15-environment-variables--config)
16. [Security Best Practices](#16-security-best-practices)
17. [Performance & Best Practices](#17-performance--best-practices)
18. [Interview Questions & Answers](#18-interview-questions--answers)
19. [Coding Questions Asked in Interviews](#19-coding-questions-asked-in-interviews)
20. [Cheat Sheet](#20-cheat-sheet)

---

## 1. What is Node.js?

- **Node.js** is an open-source, cross-platform **JavaScript runtime environment** that runs JavaScript **outside the browser**.
- Built on Google Chrome's **V8 JavaScript engine**.
- Uses an **event-driven, non-blocking I/O** model, which makes it lightweight and efficient.
- Created by **Ryan Dahl** in 2009.
- Used for **REST APIs, real-time apps (chat), streaming, microservices, CLI tools**.

### Key Features

| Feature | Description |
|---|---|
| Asynchronous & non-blocking | Doesn't wait for I/O to finish; continues executing other code |
| Single-threaded (event loop) | One main thread handles many connections |
| Fast | V8 compiles JS to machine code |
| Cross-platform | Windows, macOS, Linux |
| npm | World's largest package ecosystem |
| Scalable | Handles thousands of concurrent connections |
| Same language everywhere | JavaScript on frontend and backend |

### Node.js is NOT

- Not a language (it's a runtime).
- Not a framework (Express is a framework built on Node).
- Not ideal for **CPU-intensive** tasks (image processing, heavy calculations) on the main thread.

### Node.js vs Browser JavaScript

| Browser JS | Node.js |
|---|---|
| Has `window`, `document`, DOM | Has `global`, `process`, `require` |
| Can't access file system | Can read/write files |
| Runs in browser sandbox | Runs on server/OS |
| ES modules natively | CommonJS (default) + ES modules |

---

## 2. Architecture: V8, libuv & Event Loop

```
        Your JavaScript Code
                 │
        ┌────────▼────────┐
        │   Node.js APIs  │  (fs, http, path, ...)
        └────────┬────────┘
        ┌────────▼────────┐        ┌─────────────────────┐
        │   V8 Engine     │        │       libuv         │
        │ (runs JS code)  │        │  Event Loop         │
        └─────────────────┘        │  Thread Pool (4)    │
                                   │  Async I/O          │
                                   └─────────────────────┘
```

- **V8** – executes JavaScript (written in C++).
- **libuv** – C library that provides the **event loop**, **thread pool**, and async I/O (file, network, DNS).
- **Thread pool** – default size **4** threads; handles heavy tasks like file I/O, crypto, zlib compression.

### How does Node.js handle many requests with a single thread?

1. Request arrives → main thread picks it up.
2. If it's an I/O operation (DB query, file read), Node **offloads** it to libuv / OS.
3. Main thread moves on to the next request (doesn't wait).
4. When the I/O finishes, its **callback** is put in the queue.
5. The **event loop** picks the callback and executes it on the main thread.

### Blocking vs Non-Blocking

```js
const fs = require('fs');

// BLOCKING (synchronous) - stops everything until file is read
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
console.log('Done');

// NON-BLOCKING (asynchronous) - continues executing
fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log(data);
});
console.log('This runs first');
```

---

## 3. Setup, npm & package.json

```bash
node -v                 # check Node version
npm -v                  # check npm version
npm init -y             # create package.json
node app.js             # run a file
```

### npm Commands

| Command | Purpose |
|---|---|
| `npm install <pkg>` | Install a package locally |
| `npm install -g <pkg>` | Install globally |
| `npm install --save-dev <pkg>` | Install as devDependency |
| `npm uninstall <pkg>` | Remove a package |
| `npm update` | Update packages |
| `npm run <script>` | Run a script from package.json |
| `npm audit` | Check for vulnerabilities |
| `npx <pkg>` | Run a package without installing globally |

### package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": { "nodemon": "^3.0.0" }
}
```

### dependencies vs devDependencies

| dependencies | devDependencies |
|---|---|
| Needed to **run** the app in production | Needed only during **development** |
| express, mongoose, bcrypt | nodemon, jest, eslint |

### package.json vs package-lock.json

- **package.json** – lists dependencies with version ranges.
- **package-lock.json** – locks the **exact versions** installed so every machine gets identical dependencies.

### Semantic Versioning (`^` and `~`)

`MAJOR.MINOR.PATCH` e.g., `4.18.2`

- `^4.18.2` → allows updates to **minor and patch** (4.x.x)
- `~4.18.2` → allows updates to **patch only** (4.18.x)
- `4.18.2` → exact version

---

## 4. Modules (CommonJS vs ES Modules)

A **module** is a reusable block of code in its own file with its own scope.

### CommonJS (default in Node.js)

```js
// math.js
const add = (a, b) => a + b;
const sub = (a, b) => a - b;
module.exports = { add, sub };

// app.js
const { add, sub } = require('./math');
console.log(add(2, 3));
```

### ES Modules (ESM)

Enable with `"type": "module"` in package.json or use `.mjs` extension.

```js
// math.js
export const add = (a, b) => a + b;
export default function greet() { console.log('Hi'); }

// app.js
import greet, { add } from './math.js';
```

### Differences

| CommonJS | ES Modules |
|---|---|
| `require()` / `module.exports` | `import` / `export` |
| Loaded **synchronously** | Loaded **asynchronously** |
| Dynamic (can `require` anywhere) | Static (top-level imports) |
| `__dirname`, `__filename` available | Not available (use `import.meta.url`) |
| Default in Node | Needs `"type": "module"` |

### `module.exports` vs `exports`

`exports` is a shorthand reference to `module.exports`. If you **reassign** `exports = {...}`, it breaks the link. Always use `module.exports = ...` when exporting a single value.

### How `require()` works

1. **Resolve** – find the file path (core module → file → `node_modules`).
2. **Load** – read file content.
3. **Wrap** – wrap code in a function `(exports, require, module, __filename, __dirname)`.
4. **Execute** – run the code.
5. **Cache** – store the result; next `require` of the same file returns the cached copy.

---

## 5. Core Modules

Built into Node.js – no installation required.

| Module | Purpose |
|---|---|
| `fs` | File system operations |
| `path` | Handle file/directory paths |
| `http` / `https` | Create servers and make requests |
| `os` | Operating system info |
| `events` | EventEmitter |
| `url` | Parse URLs |
| `crypto` | Hashing, encryption, random bytes |
| `stream` | Streaming data |
| `util` | Utility functions (`promisify`) |
| `child_process` | Spawn child processes |
| `cluster` | Multi-process scaling |
| `zlib` | Compression |
| `readline` | Read input line by line |

### path module

```js
const path = require('path');

path.join('/users', 'john', 'file.txt');   // /users/john/file.txt
path.resolve('file.txt');                  // absolute path
path.basename('/a/b/file.txt');            // file.txt
path.extname('file.txt');                  // .txt
path.dirname('/a/b/file.txt');             // /a/b
```

### os module

```js
const os = require('os');
os.platform();    // 'win32', 'linux', 'darwin'
os.cpus().length; // number of CPU cores
os.totalmem();    // total memory in bytes
os.freemem();     // free memory
```

### util.promisify

Converts callback-based functions to promise-based:

```js
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

const data = await readFile('file.txt', 'utf8');
```

### crypto

```js
const crypto = require('crypto');

crypto.createHash('sha256').update('hello').digest('hex');
crypto.randomBytes(16).toString('hex');
```

---

## 6. Asynchronous Programming

### 1. Callbacks

A function passed as an argument to be executed later.

```js
fs.readFile('a.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);   // error-first callback
  console.log(data);
});
```

> Node convention: **error-first callbacks** – first argument is always the error.

**Callback Hell** – deeply nested callbacks that are hard to read:

```js
getUser(id, (err, user) => {
  getOrders(user.id, (err, orders) => {
    getItems(orders[0].id, (err, items) => {
      // ...pyramid of doom
    });
  });
});
```

### 2. Promises

Represents a future value. Three states: **pending**, **fulfilled**, **rejected**.

```js
const getData = () => new Promise((resolve, reject) => {
  setTimeout(() => resolve('Data received'), 1000);
});

getData()
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('Done'));
```

### Promise Combinators

| Method | Behavior |
|---|---|
| `Promise.all([...])` | Waits for **all** to resolve; rejects if **any** rejects |
| `Promise.allSettled([...])` | Waits for all; returns status of each (never rejects) |
| `Promise.race([...])` | Returns the **first settled** (resolved or rejected) |
| `Promise.any([...])` | Returns the **first fulfilled**; rejects only if all reject |

### 3. Async / Await

Syntactic sugar over promises – makes async code look synchronous.

```js
const fs = require('fs/promises');

async function readFiles() {
  try {
    const a = await fs.readFile('a.txt', 'utf8');
    const b = await fs.readFile('b.txt', 'utf8');
    console.log(a, b);
  } catch (err) {
    console.error(err);
  }
}
```

**Run in parallel** (faster than sequential awaits):

```js
const [a, b] = await Promise.all([
  fs.readFile('a.txt', 'utf8'),
  fs.readFile('b.txt', 'utf8')
]);
```

### Timers

```js
setTimeout(() => console.log('after 1s'), 1000);
const id = setInterval(() => console.log('every 1s'), 1000);
clearInterval(id);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));
```

---

## 7. Event Loop Phases (Deep Dive)

The **event loop** continuously checks for work and runs callbacks. Phases (in order):

```
   ┌───────────────────────────┐
┌─>│         timers            │  setTimeout, setInterval callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │   pending callbacks       │  some system-level callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │     idle, prepare         │  internal use
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │         poll              │  retrieve new I/O events; run I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │         check             │  setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
└──┤     close callbacks       │  socket.on('close')
   └───────────────────────────┘
```

### Microtask Queues (run between phases)

1. `process.nextTick()` queue — **highest priority**
2. Promise microtasks (`.then`, `await`)

### Classic Output Question

```js
console.log('1');
setTimeout(() => console.log('2 - setTimeout'), 0);
setImmediate(() => console.log('3 - setImmediate'));
Promise.resolve().then(() => console.log('4 - promise'));
process.nextTick(() => console.log('5 - nextTick'));
console.log('6');
```

**Output:**

```
1
6
5 - nextTick
4 - promise
2 - setTimeout      (order of 2 & 3 can vary in main module)
3 - setImmediate
```

**Order of priority:** synchronous code → `nextTick` → Promises → timers → I/O → `setImmediate`.

---

## 8. EventEmitter

Node.js is event-driven. The `events` module lets you create and handle custom events.

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Listen
emitter.on('greet', (name) => console.log(`Hello, ${name}`));
emitter.once('start', () => console.log('Runs only once'));

// Emit
emitter.emit('greet', 'John');
emitter.emit('start');
emitter.emit('start');   // nothing happens

// Remove
emitter.off('greet', handler);
emitter.removeAllListeners('greet');
```

### Custom class extending EventEmitter

```js
class Chat extends EventEmitter {
  sendMessage(msg) {
    this.emit('message', msg);
  }
}
const chat = new Chat();
chat.on('message', (m) => console.log('Received:', m));
chat.sendMessage('Hi');
```

> Many Node core modules (`http`, `fs` streams, `net`) are built on EventEmitter.

---

## 9. File System (fs)

### Sync vs Async vs Promise

```js
const fs = require('fs');
const fsp = require('fs/promises');

// Sync (blocking) - avoid in servers
fs.readFileSync('a.txt', 'utf8');

// Callback (non-blocking)
fs.readFile('a.txt', 'utf8', (err, data) => {});

// Promise (modern)
const data = await fsp.readFile('a.txt', 'utf8');
```

### Common Operations

```js
await fsp.writeFile('a.txt', 'Hello');           // create / overwrite
await fsp.appendFile('a.txt', ' World');         // append
await fsp.readFile('a.txt', 'utf8');             // read
await fsp.unlink('a.txt');                       // delete file
await fsp.rename('a.txt', 'b.txt');              // rename
await fsp.mkdir('folder', { recursive: true });  // create folder
await fsp.readdir('folder');                     // list directory
await fsp.rm('folder', { recursive: true });     // delete folder
await fsp.stat('a.txt');                         // file info (size, dates)
fs.existsSync('a.txt');                          // check existence
```

---

## 10. Streams & Buffers

### Buffer

A **Buffer** is a temporary memory area to hold **binary data**.

```js
const buf = Buffer.from('Hello');
console.log(buf);                  // <Buffer 48 65 6c 6c 6f>
console.log(buf.toString());       // Hello
const empty = Buffer.alloc(10);    // 10 zero-filled bytes
```

### Streams

Streams process data in **chunks** instead of loading everything into memory. Ideal for **large files**.

| Type | Description | Example |
|---|---|---|
| **Readable** | Source to read from | `fs.createReadStream` |
| **Writable** | Destination to write to | `fs.createWriteStream` |
| **Duplex** | Both read & write | TCP socket |
| **Transform** | Modifies data while passing | `zlib.createGzip()` |

```js
const fs = require('fs');

// Bad for large files - loads all into memory
fs.readFile('big.txt', (err, data) => { ... });

// Good - streams in chunks
const readStream = fs.createReadStream('big.txt');
const writeStream = fs.createWriteStream('copy.txt');
readStream.pipe(writeStream);
```

### Events of Streams

`data`, `end`, `error`, `finish`, `close`

```js
readStream.on('data', chunk => console.log('chunk size:', chunk.length));
readStream.on('end', () => console.log('finished reading'));
```

### Compression with pipe

```js
const zlib = require('zlib');
fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('file.txt.gz'));
```

### Why streams?

- **Memory efficient** – doesn't load the whole file.
- **Time efficient** – start processing as soon as the first chunk arrives.
- **Backpressure** handling – `pipe()` manages speed differences between source and destination automatically.

---

## 11. Creating an HTTP Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else if (req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'John' }]));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

### Reading POST body manually

```js
let body = '';
req.on('data', chunk => body += chunk);
req.on('end', () => {
  const data = JSON.parse(body);
  res.end('Received');
});
```

> This is why frameworks like **Express** exist: they simplify routing, body parsing, and middleware.

---

## 12. Error Handling

### 1. try/catch (with async/await and sync code)

```js
try {
  const data = JSON.parse('invalid json');
} catch (err) {
  console.error(err.message);
}
```

### 2. Error-first callbacks

```js
fs.readFile('x.txt', (err, data) => {
  if (err) return console.error(err);
});
```

### 3. Promise `.catch()`

```js
fetchData().catch(err => console.error(err));
```

### 4. EventEmitter `error` event

```js
stream.on('error', err => console.error(err));
```

> An `error` event **without a listener** will crash the process.

### 5. Global handlers (last resort)

```js
process.on('uncaughtException', (err) => {
  console.error('Uncaught:', err);
  process.exit(1);          // restart via PM2
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
```

### Operational vs Programmer Errors

| Operational | Programmer |
|---|---|
| Runtime problems: DB down, file not found, invalid input | Bugs: `undefined` access, wrong logic |
| **Handle** gracefully | **Fix** the code; restart the process |

### Custom Error Class

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

## 13. Global Objects & process

### Global Objects

`global`, `process`, `console`, `Buffer`, `__dirname`, `__filename` (CommonJS), `setTimeout`, `setInterval`, `setImmediate`, `require`, `module`, `exports`

```js
console.log(__dirname);    // absolute path of the current directory
console.log(__filename);   // absolute path of the current file
```

### process object

| Property / Method | Description |
|---|---|
| `process.argv` | Command-line arguments |
| `process.env` | Environment variables |
| `process.cwd()` | Current working directory |
| `process.exit(code)` | Exit the process (0 = success, 1 = error) |
| `process.pid` | Process ID |
| `process.platform` | OS platform |
| `process.memoryUsage()` | Memory usage info |
| `process.uptime()` | How long the process has been running |
| `process.on('exit', fn)` | Run code on exit |
| `process.nextTick(fn)` | Schedule a microtask |

```js
// node app.js John 25
console.log(process.argv);
// ['path/to/node', 'path/to/app.js', 'John', '25']
```

---

## 14. Scaling: Cluster, Worker Threads, Child Process

Node runs on a **single thread** by default, so it uses only **one CPU core**. To utilize all cores or handle CPU-heavy tasks:

### 1. Cluster Module

Creates multiple **worker processes** (one per CPU core), all sharing the same server port.

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  http.createServer((req, res) => {
    res.end(`Handled by ${process.pid}`);
  }).listen(3000);
}
```

### 2. Worker Threads

Run **CPU-intensive JavaScript** in separate threads within the same process (shared memory possible).

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.on('message', (result) => console.log('Result:', result));
} else {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) sum += i;
  parentPort.postMessage(sum);
}
```

### 3. Child Process

Spawn **separate processes** to run other programs/commands.

```js
const { exec, spawn, fork } = require('child_process');

exec('ls -la', (err, stdout, stderr) => console.log(stdout));
```

| Method | Use |
|---|---|
| `exec` | Run a shell command, buffer the output |
| `spawn` | Run a command, **stream** the output |
| `fork` | Spawn a new **Node.js** process with IPC messaging |

### Cluster vs Worker Threads vs Child Process

| Feature | Cluster | Worker Threads | Child Process |
|---|---|---|---|
| Unit | Processes | Threads | Processes |
| Memory | Separate | Can share | Separate |
| Best for | Scaling servers | CPU-heavy tasks | Running external programs |

### Other Scaling Techniques

- **PM2** (process manager with cluster mode, auto-restart, logs)
- **Load balancer** (Nginx)
- **Caching** (Redis)
- **Horizontal scaling** with containers (Docker / Kubernetes)

---

## 15. Environment Variables & Config

```bash
npm install dotenv
```

**`.env`**

```
PORT=3000
DB_URL=mongodb://localhost:27017/mydb
NODE_ENV=development
```

```js
require('dotenv').config();
console.log(process.env.PORT);
```

- Never commit `.env` – add it to `.gitignore`.
- Use `NODE_ENV=production` in production (enables optimizations in many libraries).
- Node 20.6+ supports `node --env-file=.env app.js` natively.

---

## 16. Security Best Practices

| Practice | How |
|---|---|
| Validate & sanitize input | `joi`, `zod`, `validator` |
| Hash passwords | `bcrypt` / `argon2` |
| Use HTTPS | TLS certificates |
| Secure HTTP headers | `helmet` |
| Rate limiting | `express-rate-limit` |
| Prevent injection (SQL / NoSQL) | Parameterized queries, `express-mongo-sanitize` |
| Prevent XSS | Escape output, sanitize input |
| Prevent CSRF | CSRF tokens, SameSite cookies |
| Secrets management | Environment variables, never hardcode |
| Keep dependencies updated | `npm audit`, `npm audit fix` |
| Avoid `eval()` | Code injection risk |
| Run as non-root user | In production/Docker |
| Limit payload size | Prevent DoS |

---

## 17. Performance & Best Practices

- **Never block the event loop** – avoid heavy sync code, `*Sync` methods in servers, huge loops, and big `JSON.parse`.
- Use **async/await** with proper error handling.
- Use **streams** for large files.
- Use **caching** (Redis, in-memory).
- Use **clustering** or PM2 to use all CPU cores.
- Use **compression** (gzip) for responses.
- **Connection pooling** for databases.
- Use **pagination** for large data sets.
- Use **logging** libraries (winston, pino), not just `console.log`.
- Use **linting & formatting** (ESLint, Prettier).
- **Graceful shutdown** – close DB connections and servers on `SIGTERM`.

```js
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

### Memory Leaks – Common Causes

- Global variables
- Unremoved event listeners
- Uncleared timers / intervals
- Unbounded caches
- Closures holding large references

---

## 18. Interview Questions & Answers

### Basic Level

**Q1. What is Node.js?**
An open-source, cross-platform JavaScript runtime built on Chrome's V8 engine that lets you run JavaScript on the server. It uses an event-driven, non-blocking I/O model.

**Q2. Is Node.js single-threaded?**
JavaScript execution happens on a **single main thread** (the event loop). However, Node uses libuv's **thread pool** (default 4 threads) and the OS for I/O, crypto, and compression, so it is not purely single-threaded under the hood.

**Q3. What is npm?**
Node Package Manager – the default package manager for Node.js, used to install, share, and manage packages.

**Q4. What is the difference between Node.js and JavaScript?**
JavaScript is the language. Node.js is a runtime that executes JavaScript outside the browser with extra APIs (`fs`, `http`, `os`).

**Q5. What is the V8 engine?**
Google's open-source high-performance JavaScript engine written in C++. It compiles JavaScript to machine code.

**Q6. What is non-blocking I/O?**
Operations such as file or DB access don't stop the program; Node continues executing other code and handles the result later through a callback/promise.

**Q7. What is the difference between `require` and `import`?**
`require` is CommonJS (synchronous, dynamic). `import` is ES Modules (static, async-capable, needs `"type": "module"`).

**Q8. What are core modules?**
Modules built into Node.js: `fs`, `http`, `path`, `os`, `events`, `crypto`, `stream`, etc.

**Q9. What is `package.json`?**
A metadata file containing project name, version, scripts, and dependencies.

**Q10. What are `dependencies` and `devDependencies`?**
`dependencies` are required in production; `devDependencies` are only for development/testing tools.

**Q11. What is `package-lock.json`?**
Locks exact versions of installed packages to ensure consistent installs across environments.

**Q12. What is `__dirname` vs `process.cwd()`?**
`__dirname` is the directory of the **current file**. `process.cwd()` is the directory from where the **node command was run**.

### Intermediate Level

**Q13. What is the event loop?**
A mechanism that continuously checks the call stack and callback queues, executing callbacks when the stack is empty. It lets Node handle many async operations on a single thread.

**Q14. What is the difference between `process.nextTick()` and `setImmediate()`?**
`nextTick` callbacks run **immediately after the current operation**, before the event loop continues (highest priority). `setImmediate` runs in the **check phase** of the next loop iteration.

**Q15. What is the difference between `setTimeout(fn, 0)` and `setImmediate()`?**
Both defer execution. `setTimeout(0)` runs in the **timers** phase; `setImmediate` in the **check** phase. Inside an I/O callback, `setImmediate` always runs first. In the main module, the order is non-deterministic.

**Q16. What is callback hell and how do you avoid it?**
Deeply nested callbacks that are hard to maintain. Avoid with Promises, async/await, modularizing code, and named functions.

**Q17. What are Promises?**
Objects representing the eventual completion or failure of an async operation, with states pending, fulfilled, and rejected.

**Q18. What is the difference between `Promise.all` and `Promise.allSettled`?**
`Promise.all` rejects as soon as **one** promise rejects. `Promise.allSettled` waits for **all** and returns each result's status.

**Q19. What are streams? Why use them?**
Objects that process data piece by piece. They save memory and let you start processing before all data has arrived. Types: Readable, Writable, Duplex, Transform.

**Q20. What is a Buffer?**
A fixed-size chunk of memory outside the V8 heap used to handle binary data (files, network packets).

**Q21. What is `EventEmitter`?**
A class from the `events` module that allows objects to emit named events and register listeners for them.

**Q22. What is the difference between `exec`, `spawn`, and `fork`?**
`exec` runs a shell command and buffers output; `spawn` streams output; `fork` creates a new Node.js process with an IPC channel.

**Q23. What is middleware?**
A function in frameworks like Express with access to `req`, `res`, and `next` that runs during the request-response cycle.

**Q24. How do you handle errors in Node.js?**
`try/catch` with async/await, error-first callbacks, `.catch()` on promises, `error` event listeners, and global handlers (`uncaughtException`, `unhandledRejection`) as a last resort.

**Q25. What is the purpose of `module.exports`?**
It defines what a module exposes to other files when they `require()` it.

**Q26. What is `util.promisify`?**
Converts a callback-style function (error-first) into a function that returns a Promise.

### Advanced / Tricky Level

**Q27. Explain the phases of the event loop.**
Timers → Pending callbacks → Idle/Prepare → Poll → Check → Close callbacks. Microtasks (`nextTick`, promises) run between phases.

**Q28. How does Node.js handle concurrency if it is single-threaded?**
Through the event loop and non-blocking I/O. Slow operations are delegated to the OS or libuv's thread pool, and their callbacks are executed later on the main thread.

**Q29. What is the libuv thread pool?**
A pool of threads (default 4, configurable via `UV_THREADPOOL_SIZE`) used for operations like file system access, DNS lookup, crypto, and zlib.

**Q30. Cluster vs Worker Threads – when to use which?**
Use **cluster** to scale a server across CPU cores (multiple processes). Use **worker threads** to offload **CPU-intensive** tasks without blocking the main thread.

**Q31. How do you prevent blocking the event loop?**
Avoid sync methods and heavy loops, use streams, offload CPU work to worker threads/child processes, break up large tasks, and use async APIs.

**Q32. What is backpressure in streams?**
When a writable stream can't consume data as fast as the readable produces it. `pipe()` handles it automatically by pausing the readable until the writable is ready.

**Q33. What is the difference between `fs.readFile` and `fs.createReadStream`?**
`readFile` loads the **entire file** into memory; `createReadStream` reads it in **chunks**, which is better for large files.

**Q34. What are `uncaughtException` and `unhandledRejection`?**
Global events fired when an error or rejected promise is not handled. They should be used for logging and graceful shutdown, not for continuing as normal.

**Q35. What are memory leaks, and how do you find them?**
Memory that is no longer needed but not released. Find with `process.memoryUsage()`, Chrome DevTools (`node --inspect`), heap snapshots, and tools like `clinic.js`.

**Q36. What is PM2?**
A production process manager for Node.js providing auto-restart, clustering, log management, and monitoring.

**Q37. What are the differences between `require()` caching and ES module loading?**
`require()` caches the module after the first load and returns the same exported object. ESM also caches modules, but uses live bindings and asynchronous loading.

**Q38. What are `Readable` stream modes?**
**Flowing** (data automatically emitted via `data` events or `pipe`) and **paused** (data read manually via `read()`).

**Q39. How do you debug a Node.js application?**
`console.log`, the `node --inspect` flag with Chrome DevTools, VS Code debugger, and the `debugger` statement.

**Q40. What is REPL?**
Read-Eval-Print-Loop – an interactive shell started by running `node` in the terminal.

---

## 19. Coding Questions Asked in Interviews

### 1. Read a file asynchronously and print its content

```js
const fs = require('fs/promises');

(async () => {
  try {
    const data = await fs.readFile('input.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
```

### 2. Create a simple HTTP server returning JSON

```js
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello World' }));
}).listen(3000);
```

### 3. Copy a large file using streams

```js
const fs = require('fs');
fs.createReadStream('big.mp4')
  .pipe(fs.createWriteStream('copy.mp4'))
  .on('finish', () => console.log('Copied!'));
```

### 4. Custom EventEmitter

```js
const EventEmitter = require('events');
const e = new EventEmitter();

e.on('order', (item) => console.log(`Order placed: ${item}`));
e.emit('order', 'Pizza');
```

### 5. Convert callback to promise

```js
const fs = require('fs');

const readFilePromise = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

readFilePromise('a.txt').then(console.log).catch(console.error);
```

### 6. Run promises in parallel

```js
const wait = (ms, v) => new Promise(r => setTimeout(() => r(v), ms));

(async () => {
  console.time('parallel');
  const results = await Promise.all([wait(1000, 'A'), wait(1000, 'B')]);
  console.log(results);          // ['A', 'B']
  console.timeEnd('parallel');   // ~1000ms (not 2000ms)
})();
```

### 7. Predict the output (very common!)

```js
console.log('Start');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promise'));

process.nextTick(() => console.log('nextTick'));

console.log('End');
```

**Answer:**

```
Start
End
nextTick
Promise
Timeout
```

### 8. Count word frequency in a file

```js
const fs = require('fs');

const text = fs.readFileSync('input.txt', 'utf8').toLowerCase();
const words = text.match(/\b\w+\b/g) || [];

const freq = words.reduce((acc, w) => {
  acc[w] = (acc[w] || 0) + 1;
  return acc;
}, {});

console.log(freq);
```

### 9. Simple retry function with async/await

```js
async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retry ${i + 1}...`);
    }
  }
}
```

### 10. Basic Express-like Router (using http only)

```js
const http = require('http');

const routes = {
  'GET /': (req, res) => res.end('Home'),
  'GET /about': (req, res) => res.end('About'),
};

http.createServer((req, res) => {
  const handler = routes[`${req.method} ${req.url}`];
  if (handler) return handler(req, res);
  res.statusCode = 404;
  res.end('Not Found');
}).listen(3000);
```

---

## 20. Cheat Sheet

### Quick Facts

- **Node.js** = JavaScript runtime (V8 + libuv + core APIs).
- **Single-threaded event loop**, non-blocking I/O.
- **Good for:** I/O-heavy apps (APIs, chat, streaming). **Bad for:** CPU-heavy tasks (use worker threads).
- **Modules:** CommonJS (`require`) by default; ESM (`import`) with `"type": "module"`.
- **Priority:** sync code → `process.nextTick` → Promises → timers → I/O → `setImmediate`.
- **Streams** for large data; **Buffer** for binary data.
- **Cluster** = multiple processes; **Worker Threads** = multiple threads; **Child Process** = external programs.
- Error-first callback: `(err, data) => {}`.
- Use **PM2** in production; **dotenv** for config; **nodemon** in development.

### Commonly Used Packages

| Category | Packages |
|---|---|
| Web framework | express, fastify, koa, nestjs |
| Database | mongoose, sequelize, prisma, pg, mysql2 |
| Auth | jsonwebtoken, bcrypt, passport |
| Validation | joi, zod, express-validator |
| Real-time | socket.io, ws |
| Logging | winston, pino, morgan |
| Testing | jest, mocha, chai, supertest |
| Utilities | lodash, axios, dayjs, uuid |
| Dev tools | nodemon, eslint, prettier |
| Process manager | pm2 |

### Must-Remember Points

- Never block the event loop.
- Always handle errors (`try/catch`, `.catch()`, `error` events).
- Prefer `async/await` and `fs/promises`.
- Use streams for big files.
- Keep secrets in `.env` and out of Git.
- Understand the event loop order; it is a favorite interview topic.
- Know the difference between `process.nextTick`, `Promise.then`, `setTimeout`, and `setImmediate`.

---

### Final Interview Tips

1. **Master the event loop** – most interviews include at least one output-prediction question.
2. **Practice async code** – callbacks, promises, async/await, and `Promise.all`.
3. **Build a small project** (REST API with Express + MongoDB + JWT) and be ready to explain it.
4. **Know the "why"** – why Node is non-blocking, why streams, why cluster.
5. **Be honest** – if you don't know something, explain how you'd find out.

*Good luck with your interview!* 🚀
