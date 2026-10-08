# Technical Interview – Mock Q&A
**Candidate:** Kamlakant Kumar
**Role:** Software Development Engineer (SDE) – MERN Stack · Java · DSA
**Format:** Interviewer asks → Model answer in depth

> **How to use this file:** Read the answer, then re-say it in your own words. Interviewers can tell a memorised answer from an understood one. Answers that reference *your* projects should be adjusted to what you actually built. Never claim something you can't defend.

## Table of Contents
1. Round 1 – Introduction & Warm-up
2. Round 2 – Project Deep Dive: AurixCareer
3. Round 3 – Project Deep Dive: College Helpdesk Chatbot AI
4. Round 4 – Experience (InAmigos Foundation, Accenture)
5. Round 5 – JavaScript
6. Round 6 – React.js, Redux, Zustand
7. Round 7 – Node.js & Express.js
8. Round 8 – Databases (MongoDB, Mongoose, Prisma, MySQL)
9. Round 9 – Authentication & Security
10. Round 10 – Socket.io / WebSockets
11. Round 11 – Java & OOP
12. Round 12 – DSA Concepts + Coding Problems
13. Round 13 – Core CS (OS, DBMS, Networks)
14. Round 14 – Cloud (AWS), Cybersecurity, DevOps Tools
15. Round 15 – Testing, Performance, Agile
16. Round 16 – System Design
17. Round 17 – Behavioural / HR
18. Round 18 – Resume Red-Flag Questions
19. Questions You Should Ask the Interviewer
20. Final Preparation Checklist

---

# ROUND 1 – Introduction & Warm-up

### Q1. Tell me about yourself.
**Answer (≈90 seconds):**
"I'm Kamlakant Kumar, a final-year B.Tech Computer Science student at Parul University, Vadodara. I'm a full-stack developer working mainly with the MERN stack, and I use Java for DSA. I've built two main projects: **AurixCareer**, a recruitment and student career-preparation platform with separate student and recruiter workflows, and a **College Helpdesk Chatbot** that automates student queries using NLP. I recently completed an AI Web Development internship at InAmigos Foundation, where I built AI-powered web apps with React, Node and MongoDB. I also practise DSA regularly on LeetCode in Java. I'm looking for an SDE role where I can build reliable, well-tested software and keep growing as an engineer."

**Tip:** Structure = *who you are → what you built → what you're looking for*. Don't recite the resume line by line.

### Q2. Why do you want to be an SDE and not, say, a data analyst or QA?
**Answer:** I enjoy the loop of turning an ambiguous problem into working software. In AurixCareer I had to model two different user types, design the APIs, and make the UI usable. That end-to-end ownership is what I like. SDE roles also reward strong fundamentals (DSA, system thinking), which I enjoy practising.

### Q3. Why did you choose the MERN stack?
**Answer:**
- One language (JavaScript) across frontend and backend, which reduces context switching and lets me share validation logic and types.
- Node's non-blocking I/O fits I/O-heavy apps such as chat, job portals and APIs.
- MongoDB's flexible documents suit evolving schemas (e.g., chatbot tickets with varying metadata).
- React's component model and huge ecosystem.
- **Trade-off I'm aware of:** Node is not ideal for CPU-heavy work, and MongoDB is weaker for highly relational data. That's why in AurixCareer I used **Prisma with a relational DB** for applications, jobs and users.

### Q4. Your resume says "Java" and "MERN". Which are you stronger at, and why do you use Java for DSA?
**Answer:** I use Java for DSA because its Collections framework (HashMap, PriorityQueue, Deque, TreeMap) is rich, it's statically typed (compile-time errors), and it's widely accepted in interviews. For development I'm stronger in the MERN stack because I've shipped projects with it. I'm comfortable with Java OOP and collections and can pick up Spring Boot quickly because the underlying concepts (DI, REST, JPA) map to what I already know from Express and Prisma.

### Q5. What are your strengths and weaknesses?
**Answer:**
- **Strength:** Learning by building. I picked up Prisma, Zustand and Socket.io by using them in real projects, not just tutorials.
- **Weakness (honest + improving):** My depth in some areas, such as Redux, MySQL and system design at scale, is still basic, and my resume says so. I'm closing the gap by reading engineering blogs and designing small systems on paper, then implementing parts of them.

---

# ROUND 2 – Project Deep Dive: AurixCareer

> Interviewers spend the most time here. Know *every* decision.

### Q6. Explain AurixCareer in two minutes.
**Answer:** AurixCareer is a full-stack platform that connects students and recruiters. Students get skill-based practice, DSA/OOPs/aptitude assessments, resume management, job discovery and application, and AI-powered career guidance. Recruiters can post jobs, get candidate matching, and track applicants. The frontend is React + Vite + Tailwind with Zustand for state. The backend is Node + Express with Prisma as the ORM, JWT for role-based auth, and Socket.io for real-time features.

### Q7. Draw/describe the architecture.
**Answer:**
```
[React + Vite + Tailwind + Zustand]
        │  HTTPS (REST + WebSocket)
        ▼
[Express.js API]
  ├─ Auth middleware (JWT verify → req.user {id, role})
  ├─ Role middleware (student | recruiter)
  ├─ Controllers → Services → Prisma Client
  ├─ Socket.io server (notifications / real-time updates)
  └─ AI integration layer (career guidance)
        ▼
[Relational DB via Prisma]  (User, StudentProfile, RecruiterProfile,
                             Job, Application, Assessment, Resume …)
```
I separate **routes → controllers → services → data access** so business logic isn't tangled with HTTP handling, which makes it testable.

### Q8. Why did you pick Prisma instead of Mongoose here?
**Answer:** The domain is highly relational: a Job has many Applications, an Application belongs to one Student and one Job, and a Recruiter owns many Jobs. Relational modelling gives **foreign keys, constraints, joins and transactions**. Prisma adds a type-safe client, a declarative schema, and migrations. In the chatbot project the data was document-like (tickets, conversations), so MongoDB fit better. Choosing the DB per use case was deliberate.

### Q9. Show me how you'd model Job, Application, and User in Prisma.
**Answer:**
```prisma
enum Role { STUDENT RECRUITER }
enum AppStatus { APPLIED SHORTLISTED REJECTED HIRED }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
  student   StudentProfile?
  recruiter RecruiterProfile?
}

model Job {
  id          String   @id @default(cuid())
  title       String
  description String
  skills      String[]
  recruiterId String
  recruiter   RecruiterProfile @relation(fields: [recruiterId], references: [id])
  applications Application[]
  createdAt   DateTime @default(now())
  @@index([recruiterId])
}

model Application {
  id        String    @id @default(cuid())
  jobId     String
  studentId String
  status    AppStatus @default(APPLIED)
  job       Job            @relation(fields: [jobId], references: [id])
  student   StudentProfile @relation(fields: [studentId], references: [id])
  @@unique([jobId, studentId])   // a student can apply only once per job
}
```
The `@@unique([jobId, studentId])` constraint enforces the "apply once" rule at the DB level, which is safer than checking only in application code (race conditions).

### Q10. How does role-based JWT authentication work in your app?
**Answer:**
1. User logs in → server verifies email + bcrypt-hashed password.
2. Server signs a JWT with payload `{ userId, role }`, a secret and an expiry.
3. Client stores it (preferably in an **httpOnly, Secure, SameSite cookie**; otherwise memory/localStorage).
4. Every protected request carries the token; `authMiddleware` verifies the signature and expiry and attaches `req.user`.
5. `requireRole('recruiter')` middleware checks `req.user.role` and returns **403** if it doesn't match.

```js
const auth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });

router.post('/jobs', auth, requireRole('recruiter'), createJob);
```
**Key point:** 401 = who are you? 403 = I know you, but you're not allowed.

### Q11. Where did you store the JWT and what are the risks?
**Answer:**
- **localStorage:** simple, but readable by any JS, so an XSS attack can steal it.
- **httpOnly cookie:** JS can't read it (protects against XSS theft), but needs CSRF protection (`SameSite=Lax/Strict`, CSRF tokens).
- **Best practice:** short-lived access token (10–15 min) + longer-lived refresh token in an httpOnly cookie, with refresh-token rotation and server-side revocation.

### Q12. A recruiter's token is stolen. What can you do, given JWTs are stateless?
**Answer:** Pure JWTs can't be revoked before expiry. Mitigations: keep the access token short-lived; maintain a **denylist** (Redis with TTL equal to the token's remaining life) or a `tokenVersion` field in the user record, which is checked and incremented on logout or password change; rotate refresh tokens and detect reuse; force re-auth for sensitive actions.

### Q13. How did you implement candidate matching for recruiters?
**Answer (be honest on depth):** Each job lists required skills; each student profile has skills. I compute a match score, for example **Jaccard/overlap-based**:
```
score = (matchedSkills / requiredSkills) * 100
```
and optionally weight skills (mandatory vs nice-to-have) and add assessment scores. Results are sorted by score and filtered by threshold.
```js
const score = (required, candidate) => {
  const set = new Set(candidate.map(s => s.toLowerCase()));
  const matched = required.filter(s => set.has(s.toLowerCase())).length;
  return Math.round((matched / required.length) * 100);
};
```
**Scaling follow-up:** For large data, push filtering into the DB (indexes on skills / a join table `StudentSkill`), precompute scores asynchronously, or use a search engine (Elasticsearch) / vector embeddings for semantic matching.

### Q14. Where is Socket.io used in the project, and why not just polling?
**Answer:** For real-time updates such as application-status changes ("You've been shortlisted"), recruiter notifications about new applicants, and live updates. Polling wastes requests and adds latency, whereas WebSockets keep a single persistent, full-duplex connection. Each user joins a **room** (`socket.join(userId)`), and the server emits to that room: `io.to(studentId).emit('application:update', payload)`.

### Q15. How do you authenticate socket connections?
**Answer:** Pass the JWT in the handshake and verify it in a Socket.io middleware:
```js
io.use((socket, next) => {
  try {
    socket.user = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
    next();
  } catch { next(new Error('unauthorized')); }
});
io.on('connection', (socket) => socket.join(socket.user.userId));
```

### Q16. How do you scale Socket.io across multiple server instances?
**Answer:** Each Node instance only knows its own sockets. Use the **Redis adapter** (`@socket.io/redis-adapter`) so emits are published through Redis pub/sub to all instances, and use sticky sessions at the load balancer (needed if long-polling fallback is used).

### Q17. Why Zustand instead of Redux?
**Answer:** Zustand is lightweight (no boilerplate, no provider, no reducers/actions), the store is a hook, and components subscribe to only the slices they select, which limits re-renders. Redux (with Redux Toolkit) is better for very large apps needing strict structure, middleware, devtools time-travel and team conventions. My app's state (auth user, job filters, assessment progress) was modest, so Zustand fit.
```js
const useAuth = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
const user = useAuth((s) => s.user);   // selector → re-render only when user changes
```

### Q18. How did you design the assessments (DSA/OOPs/aptitude)? How do you prevent cheating or answer leaks?
**Answer:** Questions live in the DB with a type, difficulty and tags. The client fetches questions **without correct answers**; submissions are sent to the server, which evaluates and stores the score. Further measures: randomise question order, enforce a server-side timer (store start time, reject late submissions), and one attempt per session. Client-side timers are only cosmetic, since the server is the source of truth.

### Q19. How does the AI-powered career guidance work?
**Answer:** The backend takes the student's profile (skills, assessment results, target role) and builds a prompt for an LLM API, which returns guidance such as skill gaps, a learning roadmap and suggested jobs. Engineering concerns I handle: API keys stay server-side, input is sanitised (prompt injection), responses are rate-limited and cached, there's a timeout/fallback, and structured JSON output is validated before it reaches the UI.

### Q20. How do you handle file/resume uploads?
**Answer:** Use `multer` to accept multipart data, restrict MIME type and size (e.g., PDF ≤ 2 MB), rename files with random IDs, and store them in object storage (S3/Cloudinary) rather than the app server's disk. Save only the URL/key in the DB. Optionally scan for malware and serve through signed URLs.

### Q21. How do you validate API input?
**Answer:** Validate at the boundary with a schema library (Zod/Joi/express-validator): types, lengths, enums, and email formats. Reject with **400/422** and field-level errors. Never trust the client, and validate server-side even if the frontend validates.

### Q22. How did you handle pagination for job listings?
**Answer:**
- **Offset:** `skip = (page-1)*limit` – easy but slow on large offsets and unstable if data changes.
- **Cursor (keyset):** `WHERE id > lastId ORDER BY id LIMIT n` – stable and fast.
```js
const jobs = await prisma.job.findMany({
  take: 10, skip: 1, cursor: { id: lastId }, orderBy: { createdAt: 'desc' }
});
```
For infinite scroll I'd use cursor-based.

### Q23. Two students click "Apply" at the same instant. What happens?
**Answer:** The unique constraint `(jobId, studentId)` prevents duplicates for the *same* student double-clicking. For different students, there's no conflict. If there were a capacity limit ("first 50 applicants only"), I'd use a **transaction** with a conditional update/atomic counter to avoid race conditions.

### Q24. What was the hardest bug or challenge you faced in AurixCareer?
**Answer (template; replace with your real one):** "Role-based routing: students could reach recruiter pages by typing the URL. I realised the frontend guard wasn't enough, so I added server-side `requireRole` checks and a `ProtectedRoute` wrapper on the client. Lesson: **frontend guards are UX; backend guards are security.**"

### Q25. If you rebuilt AurixCareer today, what would you change?
**Answer:** Add automated tests (unit + integration with Supertest), refresh-token rotation, Redis caching for hot queries, background job queue (BullMQ) for AI calls and emails, CI/CD with GitHub Actions, input validation with Zod everywhere, and observability (structured logs, error tracking).

---

# ROUND 3 – Project Deep Dive: College Helpdesk Chatbot AI

### Q26. Explain the project end to end.
**Answer:** Students ask questions about admissions, fees, exams and campus services through a React chat UI. The backend (Express) receives the message, an **NLP layer identifies the intent** (e.g., `fee_structure`), and the bot responds from a knowledge base. If confidence is low or the student asks for a human, a **ticket** is stored in MongoDB. Admins use a dashboard (JWT role-protected) to track unresolved queries and chatbot performance metrics.

### Q27. How does intent recognition work in your project?
**Answer (adapt to what you used):**
1. Preprocess: lowercase, tokenise, remove stop words, stem/lemmatise.
2. Classify the message into an intent using a library/API (e.g., Dialogflow, an NLP.js classifier, or an LLM).
3. Extract entities (e.g., course = "B.Tech").
4. Pick a response template or query the DB.
5. If `confidence < threshold` (say 0.6) → fallback → create ticket/escalate.

**Concepts to know:** TF-IDF, bag-of-words, embeddings, cosine similarity, intent vs. entity, precision/recall.

### Q28. Your resume says "reduced manual helpdesk workload by ~40%". How did you measure that?
**Answer (be honest and specific):** "I compared the share of queries resolved by the bot without escalation against the total queries in my test/pilot data: if 100 queries came in and 60 were resolved automatically, only 40% needed manual handling. The figure came from [your real method: logs/test set/pilot with N queries]." 

> ⚠️ **Warning:** This is the most likely metric to be challenged. If it was an estimate from a test dataset, say so. Saying "estimated from a test set of N queries" is far better than being caught inflating.

### Q29. How would you improve the bot's accuracy?
**Answer:** Expand training phrases per intent, log misclassified queries and retrain, add a confidence threshold with clarifying questions, use semantic search with embeddings over FAQ documents, or a RAG pipeline (retrieve relevant policy documents + LLM) so answers stay grounded and don't hallucinate. Evaluate with a labelled test set (accuracy, F1, confusion matrix).

### Q30. Design the MongoDB schemas for tickets and conversations.
**Answer:**
```js
const ticketSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  query:      { type: String, required: true },
  intent:     String,
  confidence: Number,
  status:     { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open', index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages:   [{ sender: String, text: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
ticketSchema.index({ status: 1, createdAt: -1 });  // admin dashboard query
```
**Embed vs reference:** messages are bounded and always read with the ticket → *embed*. Users are shared across collections → *reference*.

### Q31. How did you compute dashboard metrics (unresolved queries, chatbot performance)?
**Answer:** MongoDB aggregation pipeline:
```js
Ticket.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);

Ticket.aggregate([
  { $match: { createdAt: { $gte: startOfWeek } } },
  { $group: { _id: '$intent', total: { $sum: 1 }, avgConf: { $avg: '$confidence' } } },
  { $sort: { total: -1 } }
]);
```

### Q32. How do you prevent the chatbot endpoint from being abused?
**Answer:** Rate limiting (`express-rate-limit`), max message length, input sanitisation, auth/session check, and CAPTCHA if public. Log and monitor abnormal volume.

### Q33. What if the NLP service is down?
**Answer:** Timeout + circuit breaker, a keyword-based fallback, a friendly "I'll connect you to staff" message, and automatic ticket creation so no query is lost.

---

# ROUND 4 – Experience

### Q34. What did you do at InAmigos Foundation (Jun–Jul 2026)?
**Answer:** I worked as an AI Web Development Intern building AI-powered web apps with React, Node.js and MongoDB, and integrated AI features (API-based) to improve user interaction. 

**Prepare these specifics (interviewers will ask):** What exactly was the feature? Which AI API/model? How did you handle latency and errors? What was your contribution vs. the team's? Any measurable outcome? How did you test it? Did you use Git workflow/PRs?

### Q35. How did you integrate AI features? Walk through the flow.
**Answer:**
```
React UI → POST /api/ai/chat → Express (auth + validation + rate limit)
   → build prompt → call AI API (timeout, retry w/ backoff)
   → validate/parse response → save to MongoDB (optional) → respond to UI
```
Key concerns: API keys in env vars on the server only, streaming responses (SSE) for better UX, cost control (token limits, caching), and graceful error states in the UI.

### Q36. What did you learn from the internship that you didn't learn in college?
**Answer:** Working with deadlines and feedback, reading others' code, Git collaboration (branches, PRs, resolving conflicts), and that "works on my machine" isn't done: error handling, validation and edge cases matter.

### Q37. Accenture Software Engineering Virtual Simulation – what did you actually do?
**Answer:** It was a virtual job simulation covering UI architecture design, API integration, responsive development and component testing, plus Agile sprint workflows, code reviews and feature delivery in simulated cross-functional teams. I should be clear it was a **simulation, not employment**. What I took from it: breaking features into stories, estimating, reviewing code, and writing tests for components.

### Q38. What is Agile/Scrum? Explain the ceremonies.
**Answer:**
- **Scrum roles:** Product Owner (what/priority), Scrum Master (process facilitator), Dev Team (how).
- **Artifacts:** Product Backlog, Sprint Backlog, Increment.
- **Events:** Sprint (1–4 weeks), Sprint Planning, Daily Stand-up (15 min), Sprint Review (demo to stakeholders), Sprint Retrospective (improve process).
- **Concepts:** user stories, story points, velocity, Definition of Done, burndown chart.
- **Agile vs Waterfall:** iterative and adaptive vs. sequential and fixed-scope.

### Q39. How do you conduct/receive a code review?
**Answer:** As reviewer: check correctness, readability, edge cases, tests, security, performance, and naming; be specific and kind; ask questions rather than command. As author: keep PRs small, describe context, self-review first, respond to feedback without defensiveness.

---

# ROUND 5 – JavaScript (ES6+)

### Q40. `var` vs `let` vs `const`?
**Answer:**
| | var | let | const |
|---|---|---|---|
| Scope | function | block | block |
| Hoisting | hoisted, initialised `undefined` | hoisted, in **Temporal Dead Zone** | same as let |
| Re-declare | yes | no | no |
| Re-assign | yes | yes | no (binding is constant; object contents can still mutate) |

### Q41. What is hoisting? Predict the output.
```js
console.log(a); var a = 5;
console.log(b); let b = 5;
```
**Answer:** First prints `undefined` (declaration hoisted, assignment not). Second throws `ReferenceError` (TDZ). Function declarations are hoisted fully; function expressions are not.

### Q42. What is a closure? Give a practical use.
**Answer:** A closure is a function that remembers variables from its lexical scope even after the outer function has returned.
```js
function counter() {
  let c = 0;
  return { inc: () => ++c, get: () => c };   // c is private
}
const x = counter(); x.inc(); x.inc(); x.get(); // 2
```
Uses: data privacy, memoization, debounce/throttle, currying, event handlers, and React hooks (stale-closure bugs!).

### Q43. Classic: what does this print?
```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);
```
**Answer:** `3 3 3` – `var` is function-scoped, so all callbacks share one `i`. Fix: use `let` (new binding per iteration) or an IIFE.

### Q44. Explain the event loop.
**Answer:** JS is single-threaded. The **call stack** runs synchronous code. Async work (timers, I/O, network) is handled by browser/Node APIs; when finished, callbacks are queued. The **event loop** moves callbacks to the stack when it is empty. Priority: **microtasks** (Promise `.then`, `queueMicrotask`, `process.nextTick` in Node) run before **macrotasks** (`setTimeout`, `setInterval`, I/O).
```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
// 1 4 3 2
```

### Q45. Callbacks vs Promises vs async/await?
**Answer:** Callbacks lead to "callback hell" and inverted control. Promises (states: pending → fulfilled/rejected) allow chaining and `.catch`. `async/await` is syntactic sugar over promises that reads synchronously; use `try/catch`. Parallelise independent work with `Promise.all`:
```js
const [user, jobs] = await Promise.all([getUser(), getJobs()]);
```
`Promise.allSettled` (all outcomes), `Promise.race` (first to settle), `Promise.any` (first fulfilled).

### Q46. How does `this` work?
**Answer:** Depends on *how a function is called*: method call → the object; plain call → `undefined` (strict) / global; `new` → the new object; `call/apply/bind` → explicit; **arrow functions** don't have their own `this` and use the enclosing lexical one.

### Q47. Prototype and prototypal inheritance?
**Answer:** Every object has an internal `[[Prototype]]`. Property lookup walks up the prototype chain until `null`. ES6 `class` is syntax sugar over prototypes. `Object.create(proto)` creates an object with a given prototype.

### Q48. `==` vs `===`; falsy values?
**Answer:** `===` strict (no coercion); `==` coerces (`'5' == 5` true). Always prefer `===`. Falsy: `false, 0, -0, 0n, '', null, undefined, NaN`.

### Q49. Shallow vs deep copy?
**Answer:** Spread/`Object.assign` copy one level. Nested objects remain shared. Deep copy: `structuredClone(obj)` (modern), `JSON.parse(JSON.stringify())` (loses functions, Dates, undefined), or lodash `cloneDeep`.

### Q50. Implement debounce.
```js
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}
```
Use: search-as-you-type. **Throttle** limits calls to once per interval (scroll/resize).

### Q51. `map` vs `forEach` vs `filter` vs `reduce`?
**Answer:** `forEach` – side effects, returns undefined. `map` – new array of same length. `filter` – subset. `reduce` – fold to a single value.
```js
const total = items.reduce((sum, i) => sum + i.price, 0);
```

### Q52. What are ES6+ features you use regularly?
**Answer:** Destructuring, spread/rest, template literals, arrow functions, modules (`import/export`), optional chaining `?.`, nullish coalescing `??`, `Map/Set`, classes, default params, async/await.

### Q53. `null` vs `undefined`? What does `typeof null` return?
**Answer:** `undefined` = declared but not assigned; `null` = intentional absence. `typeof null === 'object'` (a historical bug).

### Q54. Event bubbling, capturing, and delegation?
**Answer:** Events travel capture (root→target) → target → bubble (target→root). **Delegation**: attach one listener to a parent and use `event.target`; efficient for dynamic lists. `stopPropagation()` stops travel; `preventDefault()` stops default behaviour.

### Q55. Currying & memoization example.
```js
const add = a => b => a + b;               // currying
const memo = fn => { const c = new Map();
  return n => c.has(n) ? c.get(n) : (c.set(n, fn(n)), c.get(n)); };
```

---

# ROUND 6 – React.js, Redux (basic), Zustand

### Q56. What is the Virtual DOM and reconciliation?
**Answer:** React keeps a lightweight JS representation of the UI. On state change it builds a new virtual tree, **diffs** it with the previous one (heuristics: different type → replace subtree; same type → update props; **keys** identify list items), and applies the minimal set of real DOM updates. React Fiber makes this incremental and interruptible.

### Q57. Why are `key`s important? Why not use array index?
**Answer:** Keys let React match items between renders. Index keys break when items are reordered/inserted/deleted, causing wrong state to attach to wrong components and wasted re-renders. Use stable unique IDs.

### Q58. Explain `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback`, `useContext`, `useReducer`.
**Answer:**
- `useState` – local state; updates are batched and async; use functional updates `setN(n => n+1)`.
- `useEffect` – side effects after render; deps array controls re-run; return a **cleanup** function.
- `useRef` – mutable value persisting across renders without causing re-render; DOM access.
- `useMemo` – memoise an expensive **value**; `useCallback` – memoise a **function** reference (useful with `React.memo`).
- `useContext` – read context without prop drilling (re-renders all consumers when value changes).
- `useReducer` – complex state transitions.

### Q59. Explain the `useEffect` dependency array.
**Answer:** `[]` runs once after mount; `[a,b]` runs when a or b change; omitted runs after every render. Missing deps causes **stale closures**; unstable deps (new object each render) cause infinite loops. Always clean up subscriptions/timers/sockets:
```js
useEffect(() => {
  const s = io(URL, { auth: { token } });
  s.on('application:update', handle);
  return () => s.disconnect();
}, [token]);
```

### Q60. How do you fetch data in React safely?
**Answer:** Handle loading/error states, abort on unmount (`AbortController`) to avoid setting state on unmounted components and race conditions, and prefer a data library (React Query/TanStack Query) for caching, retries, deduplication and background refetch.

### Q61. Controlled vs uncontrolled components?
**Answer:** Controlled: form value lives in React state (`value` + `onChange`). Uncontrolled: DOM holds the value; read via `ref`. Controlled gives validation and instant feedback; uncontrolled is simpler/faster for big forms (or use React Hook Form).

### Q62. How do you optimise React performance?
**Answer:** `React.memo`, `useMemo`/`useCallback` (only where measured), code splitting with `React.lazy` + `Suspense`, route-based lazy loading, list virtualisation (react-window), avoid creating objects/functions in props unnecessarily, colocate state, use selectors in Zustand, debounce inputs, optimise images, and profile with React DevTools Profiler.

### Q63. Props drilling and how to avoid it?
**Answer:** Passing props through many layers. Solutions: Context, state libraries (Zustand/Redux), component composition (`children`), or colocating state.

### Q64. Redux basics – explain the flow. (you listed "Redux (basic)")
**Answer:** Single **store** → UI dispatches an **action** `{type, payload}` → **reducer** (pure function `(state, action) → newState`) → store updates → subscribed components re-render. Principles: single source of truth, state is read-only, changes via pure reducers. **Redux Toolkit** removes boilerplate (`createSlice`, immer, `createAsyncThunk`). Middleware (thunk/saga) handles async.

### Q65. Redux vs Context vs Zustand — when to use which?
**Answer:** Context: low-frequency global values (theme, auth). Zustand: small/medium global state, minimal API, selective subscription. Redux Toolkit: large apps, strict patterns, devtools, middleware, big teams.

### Q66. What's React Router, and how did you build protected routes?
```jsx
const ProtectedRoute = ({ role, children }) => {
  const user = useAuth(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;
  return children;
};
<Route path="/recruiter/*" element={<ProtectedRoute role="recruiter"><RecruiterApp/></ProtectedRoute>} />
```

### Q67. What are the rules of hooks and why?
**Answer:** Call hooks only at the top level (not in loops/conditions) and only in function components or custom hooks, because React relies on the **call order** to associate state with each hook.

### Q68. What are custom hooks? Example.
```js
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}
```

### Q69. Why is state immutable in React?
**Answer:** React uses reference equality to detect changes; mutating in place keeps the same reference, so React (and memoisation) may skip updates. Create new objects/arrays: `setList([...list, item])`.

### Q70. Error boundaries?
**Answer:** Class components with `componentDidCatch`/`getDerivedStateFromError` that catch render-phase errors in children and show a fallback UI. They don't catch event handlers, async code, or SSR errors.

### Q71. Tailwind vs Bootstrap? Responsive design approach?
**Answer:** Bootstrap = prebuilt components (fast, looks alike). Tailwind = utility-first (highly customisable, small bundle with purge/JIT, more markup). I use mobile-first breakpoints (`sm: md: lg:`), flexbox/grid, relative units, and test on multiple viewports.

### Q72. Vite vs Webpack?
**Answer:** Vite uses native ES modules in dev (no bundling → instant server start) and Rollup for production builds; HMR is very fast. Webpack bundles everything first (slower start) but has a mature plugin/loader ecosystem and fine-grained config.

---

# ROUND 7 – Node.js & Express.js

### Q73. How does Node.js handle concurrency if it's single-threaded?
**Answer:** The JS code runs on one thread, but I/O is delegated to the OS/**libuv** thread pool (default 4 threads) for file system, DNS, crypto, etc. When done, callbacks return via the event loop. This suits I/O-bound workloads. CPU-bound work blocks the loop → use **worker_threads**, child processes, or offload to a queue.

### Q74. Phases of the Node event loop?
**Answer:** timers → pending callbacks → idle/prepare → **poll** (I/O) → **check** (`setImmediate`) → close callbacks. `process.nextTick` and Promise microtasks run between phases.

### Q75. What is middleware in Express? Order matters?
**Answer:** Functions `(req, res, next)` run in sequence; each can modify req/res, end the cycle, or call `next()`. Order matters: body parser → cors → logging → routes → 404 handler → **error handler** (4 args `(err, req, res, next)`).

### Q76. How do you do centralised error handling?
```js
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});
```
Express 4 doesn't auto-catch async errors; wrap them (Express 5 does).

### Q77. REST principles and correct status codes?
**Answer:** Stateless, resource-based URLs, proper verbs, uniform interface, cacheable, layered. 
- GET (read, idempotent), POST (create), PUT (replace, idempotent), PATCH (partial), DELETE (idempotent).
- Codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests, 500 Internal, 503 Unavailable.

### Q78. What is CORS and how do you configure it?
**Answer:** Browser same-origin policy blocks cross-origin requests unless the server sends `Access-Control-Allow-Origin` etc. Non-simple requests trigger a **preflight** (`OPTIONS`). Configure whitelist origins, allow credentials only for trusted origins; never `*` with credentials.

### Q79. Streams and buffers?
**Answer:** Streams process data in chunks (readable, writable, duplex, transform) → low memory for big files. `readStream.pipe(res)` streams a file to a client rather than loading it entirely.

### Q80. `cluster` module / scaling Node?
**Answer:** Node runs on one core; `cluster` (or PM2) forks one worker per core sharing a port. Horizontal scaling: multiple instances behind a load balancer (Nginx/ALB); keep servers **stateless** (sessions/JWT/Redis).

### Q81. Security hardening for Express?
**Answer:** `helmet` (headers), rate limiting, input validation, parameterised queries/ORM, sanitise against NoSQL injection (`express-mongo-sanitize`), HTTPS, secrets in env vars, dependency audits (`npm audit`), httpOnly cookies, CSRF protection, limit body size, avoid leaking stack traces.

### Q82. `process.nextTick` vs `setImmediate` vs `setTimeout(0)`?
**Answer:** `nextTick` runs right after the current operation, before other microtasks; `setImmediate` runs in the check phase after I/O; `setTimeout(0)` in timers phase. Inside an I/O callback `setImmediate` always fires before `setTimeout(0)`.

### Q83. `require` vs `import`?
**Answer:** CommonJS (`require`, synchronous, dynamic) vs ES Modules (`import`, static, async, tree-shakable). Use `"type": "module"` or `.mjs` for ESM in Node.

### Q84. How do you manage environment config and secrets?
**Answer:** `.env` files with `dotenv` locally (git-ignored), platform secret managers (AWS Secrets Manager/SSM) in production; never commit secrets; separate dev/staging/prod configs.

### Q85. How would you structure a Node/Express project?
```
src/
  config/  routes/  controllers/  services/  models|prisma/  middlewares/  utils/  validators/  sockets/
tests/
```

---

# ROUND 8 – Databases (MongoDB, Mongoose, Prisma, MySQL basic)

### Q86. SQL vs NoSQL – when to choose which?
**Answer:** SQL: structured, relational data, strong consistency and ACID transactions, complex joins (orders, payments, applications). NoSQL (Mongo): flexible schema, nested documents, horizontal scaling, fast iteration (logs, chat, catalogs). Choose by access patterns and consistency needs, not hype.

### Q87. What are indexes? Trade-offs?
**Answer:** Data structures (B-Tree typically) that speed up reads from O(n) scan to O(log n). Cost: extra storage and slower writes. Types: single, compound (order matters, **leftmost prefix rule**), unique, text, TTL, multikey. Use `explain()` to verify `IXSCAN` rather than `COLLSCAN`.

### Q88. Embedding vs referencing in MongoDB?
**Answer:** Embed when data is read together, one-to-few, and bounded (document limit 16 MB). Reference when data is shared, one-to-many unbounded, or updated independently. Use `populate()` or `$lookup` (join-like, costly).

### Q89. Mongoose: schema, model, middleware, populate, lean?
**Answer:** Schema defines shape/validation; model is the collection interface; pre/post hooks (e.g., hash password in `pre('save')`); `populate` resolves refs; `.lean()` returns plain objects (faster, no getters/methods).

### Q90. Aggregation pipeline stages?
**Answer:** `$match` (filter early, uses index) → `$group` → `$project` → `$sort` → `$limit` → `$lookup` → `$unwind` → `$facet`. Put `$match`/`$limit` as early as possible.

### Q91. Does MongoDB support transactions?
**Answer:** Yes, multi-document ACID transactions on replica sets/sharded clusters (4.0+), but they cost performance; prefer designing documents so single-document atomicity suffices.

### Q92. ACID properties?
**Answer:** **A**tomicity (all or nothing), **C**onsistency (valid state to valid state), **I**solation (concurrent transactions don't interfere), **D**urability (committed data survives crashes). Example: money transfer – debit and credit in one transaction.

### Q93. Normalisation and normal forms?
**Answer:** Reduce redundancy/anomalies. 1NF: atomic values; 2NF: no partial dependency on a composite key; 3NF: no transitive dependency; BCNF: every determinant is a candidate key. Denormalise deliberately for read performance.

### Q94. SQL joins and query practice (MySQL basic).
```sql
-- INNER: only matching rows; LEFT: all left + matches; RIGHT; FULL (UNION in MySQL)
SELECT s.name, j.title
FROM applications a
JOIN students s ON s.id = a.student_id
JOIN jobs j     ON j.id = a.job_id
WHERE a.status = 'SHORTLISTED';

-- Second highest salary
SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp);

-- Count of applicants per job with > 5 applicants
SELECT job_id, COUNT(*) c FROM applications GROUP BY job_id HAVING c > 5;
```
`WHERE` filters rows before grouping; `HAVING` filters groups after.

### Q95. What is the N+1 query problem?
**Answer:** Fetching a list (1 query) then querying related data per item (N queries). Fix: eager loading — Prisma `include`, Mongoose `populate`, SQL `JOIN`, or batching (DataLoader).
```js
prisma.job.findMany({ include: { applications: true } });
```

### Q96. What does Prisma give you? Migrations?
**Answer:** Schema-first modelling, generated type-safe client, relation handling, migrations (`prisma migrate dev` creates versioned SQL; `migrate deploy` in production), `prisma studio`, and `$transaction` for atomic multi-step operations.
```js
await prisma.$transaction([
  prisma.application.update({ where: { id }, data: { status: 'HIRED' } }),
  prisma.job.update({ where: { id: jobId }, data: { openings: { decrement: 1 } } }),
]);
```

### Q97. CAP theorem?
**Answer:** A distributed system can guarantee only two of Consistency, Availability, Partition tolerance; since partitions happen, you choose C or A during one. MongoDB defaults CP-leaning (primary-based); Cassandra AP.

### Q98. Replication vs sharding?
**Answer:** Replication = copies of data for availability/read scaling (primary + secondaries). Sharding = partitioning data across nodes for write/storage scaling via a shard key (pick high cardinality, even distribution).

### Q99. Delete strategies?
**Answer:** Hard delete vs **soft delete** (`deletedAt` flag; keep audit history, add filters everywhere). Cascade rules in relational DBs (`ON DELETE CASCADE/RESTRICT/SET NULL`).

---

# ROUND 9 – Authentication & Security

### Q100. JWT structure and verification?
**Answer:** `header.payload.signature`, each Base64URL-encoded. Header: algorithm; payload: claims (`sub`, `exp`, `role`); signature = HMAC/RSA over header+payload with the secret. **Payload is encoded, not encrypted** – never put secrets in it. Always verify signature, `exp`, and pin the allowed algorithm (avoid `alg: none` attacks).

### Q101. JWT vs session-based auth?
**Answer:** Sessions: server stores state (cookie holds session ID) → easy revocation, needs shared store at scale. JWT: stateless, scales easily, good for APIs/microservices, but revocation is harder and tokens can be large.

### Q102. How should passwords be stored?
**Answer:** Never plaintext. Use a slow, salted, adaptive hash: **bcrypt/Argon2/scrypt** (not MD5/SHA-1/plain SHA-256). bcrypt cost factor ~10–12.
```js
const hash = await bcrypt.hash(password, 12);
const ok   = await bcrypt.compare(password, hash);
```

### Q103. Explain XSS, CSRF, SQL/NoSQL injection and prevention.
**Answer:**
- **XSS:** attacker injects script that runs in a victim's browser. Prevent: output encoding, React's default escaping (avoid `dangerouslySetInnerHTML`), CSP, sanitise HTML (DOMPurify), httpOnly cookies.
- **CSRF:** tricks a logged-in user's browser into sending an authenticated request. Prevent: SameSite cookies, CSRF tokens, checking Origin/Referer, not using cookies for auth on state-changing GETs.
- **SQL injection:** untrusted input concatenated into queries. Prevent: parameterised queries/ORM.
- **NoSQL injection:** `{ "email": {"$ne": null} }` bypasses login. Prevent: validate types, sanitise operators.

### Q104. OAuth 2.0 vs OpenID Connect vs JWT?
**Answer:** OAuth 2.0 = *authorisation* delegation (access tokens). OIDC = identity layer on OAuth (ID token = "who the user is"). JWT = a token *format* often used by both.

### Q105. Authentication vs Authorisation; RBAC vs ABAC?
**Answer:** AuthN = verify identity; AuthZ = verify permissions. RBAC = permissions by role (student/recruiter/admin). ABAC = by attributes/policies (e.g., recruiter can edit only jobs they own). Ownership checks matter: `job.recruiterId === req.user.id` to prevent **IDOR** (Insecure Direct Object Reference).

### Q106. HTTPS and TLS handshake in short?
**Answer:** Client hello → server certificate (verified against CA) → key exchange → symmetric session key → encrypted traffic. Provides confidentiality, integrity, authenticity.

### Q107. OWASP Top 10 – name a few.
**Answer:** Broken access control, cryptographic failures, injection, insecure design, security misconfiguration, vulnerable/outdated components, authentication failures, integrity failures, logging/monitoring failures, SSRF.

---

# ROUND 10 – Socket.io / WebSockets

### Q108. WebSocket vs HTTP polling vs SSE?
**Answer:** HTTP polling: repeated requests (wasteful). Long polling: server holds request until data. **SSE**: one-way server→client over HTTP (great for streaming AI output). **WebSocket**: full-duplex persistent TCP connection after HTTP upgrade (chat, collaboration).

### Q109. What does Socket.io add on top of raw WebSockets?
**Answer:** Auto-reconnect, fallback transports, rooms/namespaces, broadcasting, acknowledgements, heartbeat/ping-pong, binary support, and middleware.

### Q110. Rooms vs namespaces? Emit patterns?
```js
socket.emit('e', d);                 // to this client
io.emit('e', d);                     // everyone
socket.broadcast.emit('e', d);       // everyone except sender
io.to('room1').emit('e', d);         // a room
```
Namespaces separate concerns (`/chat`, `/notifications`); rooms group sockets within a namespace.

### Q111. Handling disconnects and message delivery guarantees?
**Answer:** Socket.io is at-most-once by default. For reliability: persist messages in DB first, use acknowledgements (`emit(..., ack)`), store unread notifications and fetch on reconnect (include last-seen ID), and enable connection state recovery.

---

# ROUND 11 – Java & OOP

### Q112. Four pillars of OOP with examples.
**Answer:**
- **Encapsulation** – private fields + getters/setters (`BankAccount.balance`).
- **Abstraction** – expose *what*, hide *how* (abstract classes/interfaces).
- **Inheritance** – `Dog extends Animal` (is-a; code reuse).
- **Polymorphism** – compile-time (overloading) and runtime (overriding, dynamic dispatch): `Animal a = new Dog(); a.speak();` calls Dog's version.

### Q113. Abstract class vs Interface (Java 8+)?
| | Abstract class | Interface |
|---|---|---|
| Inheritance | single | multiple |
| State | instance fields | only constants |
| Constructors | yes | no |
| Methods | abstract + concrete | abstract + default + static + private |
| Use | shared base with state ("is-a") | capability/contract ("can-do") |

### Q114. Overloading vs overriding?
**Answer:** Overloading: same name, different parameters, resolved at compile time, in the same class. Overriding: subclass redefines superclass method with same signature (covariant return allowed), resolved at runtime; can't reduce visibility; can't override `static/final/private`.

### Q115. `==` vs `.equals()`; `equals()` & `hashCode()` contract?
**Answer:** `==` compares references (primitives by value); `.equals()` compares logical equality. **Contract:** equal objects must have equal hashCodes. Violating it breaks HashMap/HashSet (object "lost" in the wrong bucket). Override both together.

### Q116. String pool, immutability, StringBuilder vs StringBuffer?
**Answer:** String literals are interned in the pool. `String` is immutable (thread-safe, cacheable hash, security) → concatenation in loops creates many objects. `StringBuilder` (mutable, not thread-safe, fast), `StringBuffer` (synchronised, slower).
```java
String a = "hi", b = "hi", c = new String("hi");
a == b;      // true
a == c;      // false
a.equals(c); // true
```

### Q117. How does HashMap work internally?
**Answer:** Array of buckets (default 16). `index = (n-1) & hash(key)`. Collisions handled by a linked list, converted to a **red-black tree** when a bucket has ≥ 8 entries (and table ≥ 64) (Java 8+). Resize at load factor 0.75 (doubling and rehashing). Average O(1) get/put; worst O(log n). Allows one null key. Not thread-safe.

### Q118. HashMap vs ConcurrentHashMap vs Hashtable vs TreeMap vs LinkedHashMap?
**Answer:** HashMap – unsynchronised, no order. Hashtable – legacy, fully synchronised, no nulls. ConcurrentHashMap – segment/bucket-level locking + CAS, high concurrency, no null keys/values. TreeMap – sorted by key (red-black tree, O(log n)). LinkedHashMap – insertion/access order (good for LRU).

### Q119. ArrayList vs LinkedList? Fail-fast vs fail-safe iterators?
**Answer:** ArrayList – dynamic array, O(1) random access, O(n) middle insert. LinkedList – doubly linked, O(1) insert at known node, O(n) access. Usually ArrayList wins due to cache locality. Fail-fast iterators throw `ConcurrentModificationException` on structural modification (ArrayList/HashMap); fail-safe iterate over a snapshot (CopyOnWriteArrayList).

### Q120. HashSet internals; Comparable vs Comparator?
**Answer:** HashSet is backed by a HashMap (elements are keys). `Comparable` – natural ordering inside the class (`compareTo`). `Comparator` – external, multiple orderings: `list.sort(Comparator.comparing(Student::getGpa).reversed())`.

### Q121. Checked vs unchecked exceptions; `final`, `finally`, `finalize`?
**Answer:** Checked (extends `Exception`, compiler forces handling: IOException). Unchecked (`RuntimeException`: NPE, IndexOutOfBounds). `final` – constant/no-override/no-inherit; `finally` – always-run block (cleanup); `finalize` – deprecated GC hook. Use try-with-resources for `AutoCloseable`.

### Q122. JVM, JRE, JDK; memory areas; garbage collection.
**Answer:** JDK = JRE + dev tools; JRE = JVM + libraries; JVM runs bytecode. Memory: **Heap** (objects; young gen: Eden/Survivor, old gen), **Stack** (per-thread frames/locals), **Metaspace** (class metadata), PC register, native stack. GC reclaims unreachable objects (Minor GC for young, Major/Full for old); collectors: G1 (default), ZGC, Parallel. Memory leaks still occur via lingering references (static collections, listeners).

### Q123. Multithreading: ways to create threads, `synchronized`, `volatile`, deadlock.
**Answer:** `extends Thread`, `implements Runnable`, `Callable` + `ExecutorService` (preferred, thread pools). `synchronized` – mutual exclusion + visibility. `volatile` – visibility/ordering for a variable, **not atomicity** (`count++` still unsafe → `AtomicInteger`). **Deadlock** conditions: mutual exclusion, hold & wait, no preemption, circular wait → avoid by consistent lock ordering, timeouts (`tryLock`). `wait/notify`, `ReentrantLock`, `CompletableFuture`.

### Q124. Java 8 features: lambdas, streams, Optional.
```java
List<String> names = students.stream()
    .filter(s -> s.getGpa() > 8)
    .sorted(Comparator.comparing(Student::getGpa).reversed())
    .map(Student::getName)
    .collect(Collectors.toList());

Map<String, Long> byDept = students.stream()
    .collect(Collectors.groupingBy(Student::getDept, Collectors.counting()));
```
Streams are lazy (terminal op triggers pipeline), single-use. `Optional` avoids NPE (`orElse`, `map`, `ifPresent`). Functional interfaces: `Predicate, Function, Consumer, Supplier`.

### Q125. Static vs instance; `this` vs `super`; constructors; access modifiers?
**Answer:** `static` belongs to the class (shared); instance belongs to the object. `this` – current object; `super` – parent. Constructors can't be inherited; can be overloaded; chaining via `this(...)`/`super(...)`. Access: private < default < protected < public.

### Q126. SOLID principles (one-liners with examples).
**Answer:** **S**ingle Responsibility (a class changes for one reason; separate `UserService` from `EmailService`), **O**pen/Closed (extend, don't modify; strategy pattern), **L**iskov (subtypes must be substitutable; Square-extends-Rectangle violation), **I**nterface Segregation (small, focused interfaces), **D**ependency Inversion (depend on abstractions; inject dependencies).

### Q127. Common design patterns you know?
**Answer:** Singleton (one instance, thread-safe via enum/double-checked locking), Factory, Builder, Observer (Socket.io events!), Strategy, Decorator (Express middleware-like chain), Adapter, MVC.

### Q128. Pass by value or reference in Java?
**Answer:** Always **pass by value**; for objects, the *reference* is copied. Reassigning the parameter doesn't affect the caller; mutating the object does.

### Q129. Immutable class – how to create?
**Answer:** `final` class, `private final` fields, no setters, defensive copies for mutable fields, constructor initialisation. (Java 16+ `record`.)

### Q130. Generics, type erasure, wildcards?
**Answer:** Compile-time type safety (`List<String>`). Erased at runtime to `Object`/bounds. `? extends T` (read-only, producer), `? super T` (write, consumer) – **PECS**.

---

# ROUND 12 – DSA Concepts + Coding Problems

> **Approach every coding question like this:** (1) clarify inputs/edge cases, (2) brute force + complexity, (3) optimise, (4) code, (5) dry run, (6) state time/space.

## 12A. Concept Questions

### Q131. Array vs LinkedList vs Stack vs Queue vs Deque?
**Answer:** Array – contiguous, O(1) index. LinkedList – O(1) insert/delete at a known node. Stack – LIFO (`push/pop/peek`; undo, DFS, parentheses). Queue – FIFO (BFS, scheduling). Deque – both ends (sliding window max). In Java use `ArrayDeque` for both stack and queue (not legacy `Stack`).

### Q132. Time complexities cheat-sheet.
| Operation | Complexity |
|---|---|
| Array access / HashMap get-put (avg) | O(1) |
| Binary search / BST (balanced) / Heap push-pop | O(log n) |
| Linear scan | O(n) |
| Merge sort / heap sort / quick sort (avg) | O(n log n) |
| Quick sort worst | O(n²) |
| BFS/DFS | O(V+E) |
| Dijkstra (PQ) | O((V+E) log V) |

### Q133. BFS vs DFS – when to use which?
**Answer:** BFS (queue) – shortest path in unweighted graphs, level order. DFS (stack/recursion) – cycle detection, topological sort, connected components, backtracking. Both O(V+E).

### Q134. Heap / PriorityQueue? Min-heap vs max-heap?
**Answer:** Complete binary tree where parent ≤ children (min-heap). Insert/extract O(log n), peek O(1), build-heap O(n). Use for top-K, scheduling, Dijkstra, median of stream. Java `PriorityQueue` is a min-heap by default.

### Q135. Recursion vs DP vs Greedy vs Backtracking?
**Answer:** Recursion – function calls itself. DP – recursion with overlapping subproblems + optimal substructure (memoise or tabulate). Greedy – locally optimal choice proves globally optimal (interval scheduling). Backtracking – explore all choices, undo (permutations, N-Queens).

### Q136. Quick sort vs merge sort?
**Answer:** Quick sort: in-place, O(n log n) avg, O(n²) worst (mitigate with random pivot), not stable, cache-friendly. Merge sort: O(n log n) always, O(n) extra space, stable. Java sorts objects with TimSort (stable, merge+insertion) and primitives with dual-pivot quicksort.

### Q137. Trie – what is it, and use cases?
**Answer:** Prefix tree where each node represents a character. Insert/search/startsWith in O(L). Use: autocomplete, spell check, prefix matching (e.g., searching skills/job titles in AurixCareer).

### Q138. Balanced BST? AVL vs Red-Black?
**Answer:** Self-balancing BSTs guarantee O(log n). AVL is more strictly balanced (faster lookups, more rotations); Red-Black allows less strict balance (faster inserts/deletes) → used in `TreeMap`/`HashMap` buckets.

### Q139. Union-Find (DSU)?
**Answer:** Tracks connected components with `find` (path compression) and `union` (by rank/size), nearly O(α(n)) ≈ O(1). Use: Kruskal's MST, cycle detection in undirected graphs, number of provinces.

## 12B. Coding Problems (Java)

### Q140. Two Sum
**Idea:** HashMap of value → index; for each `x`, check if `target - x` was seen. **O(n) time, O(n) space.**
```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

### Q141. Valid Parentheses
**Idea:** Stack; push openers, on closer check the top matches. **O(n)/O(n).**
```java
public boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.isEmpty()) return false;
            char o = st.pop();
            if ((c == ')' && o != '(') || (c == '}' && o != '{') || (c == ']' && o != '[')) return false;
        }
    }
    return st.isEmpty();
}
```

### Q142. Reverse a Linked List (iterative)
**O(n)/O(1).**
```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}
```

### Q143. Detect a cycle in a linked list (Floyd) and find its start
**Idea:** slow (1 step) / fast (2 steps) meet if a cycle exists; reset one pointer to head and move both 1 step to find the entry. **O(n)/O(1).**
```java
public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
        if (slow == fast) {
            slow = head;
            while (slow != fast) { slow = slow.next; fast = fast.next; }
            return slow;
        }
    }
    return null;
}
```

### Q144. Merge Two Sorted Lists
```java
public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), t = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { t.next = a; a = a.next; }
        else                { t.next = b; b = b.next; }
        t = t.next;
    }
    t.next = (a != null) ? a : b;
    return dummy.next;
}
```

### Q145. Binary Search (and why `mid = lo + (hi - lo)/2`)
**Answer:** `(lo+hi)/2` can overflow for large ints.
```java
public int search(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        else if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```
**Variants to know:** first/last occurrence, search in rotated sorted array, binary search on answer (Koko eating bananas).

### Q146. Longest Substring Without Repeating Characters (Sliding Window)
**O(n)/O(min(n, charset)).**
```java
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int best = 0, left = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        if (last.containsKey(c) && last.get(c) >= left) left = last.get(c) + 1;
        last.put(c, r);
        best = Math.max(best, r - left + 1);
    }
    return best;
}
```

### Q147. Maximum Subarray (Kadane)
**O(n)/O(1).**
```java
public int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}
```

### Q148. Merge Intervals
**Idea:** sort by start; merge overlapping. **O(n log n).**
```java
public int[][] merge(int[][] iv) {
    Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> res = new ArrayList<>();
    for (int[] x : iv) {
        if (res.isEmpty() || res.get(res.size() - 1)[1] < x[0]) res.add(x);
        else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], x[1]);
    }
    return res.toArray(new int[0][]);
}
```

### Q149. Top K Frequent Elements
**Idea:** frequency map + min-heap of size K → **O(n log k)**; or bucket sort → O(n).
```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    PriorityQueue<Map.Entry<Integer, Integer>> pq =
        new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());
    for (var e : freq.entrySet()) {
        pq.offer(e);
        if (pq.size() > k) pq.poll();
    }
    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--) res[i] = pq.poll().getKey();
    return res;
}
```

### Q150. Binary Tree Level Order Traversal (BFS)
```java
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}
```

### Q151. Maximum Depth / Validate BST
```java
public int maxDepth(TreeNode r) { return r == null ? 0 : 1 + Math.max(maxDepth(r.left), maxDepth(r.right)); }

public boolean isValidBST(TreeNode r) { return check(r, Long.MIN_VALUE, Long.MAX_VALUE); }
private boolean check(TreeNode n, long lo, long hi) {
    if (n == null) return true;
    if (n.val <= lo || n.val >= hi) return false;
    return check(n.left, lo, n.val) && check(n.right, n.val, hi);
}
```

### Q152. Number of Islands (DFS on grid)
**O(R·C).**
```java
public int numIslands(char[][] g) {
    int count = 0;
    for (int i = 0; i < g.length; i++)
        for (int j = 0; j < g[0].length; j++)
            if (g[i][j] == '1') { dfs(g, i, j); count++; }
    return count;
}
private void dfs(char[][] g, int i, int j) {
    if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] != '1') return;
    g[i][j] = '0';
    dfs(g, i+1, j); dfs(g, i-1, j); dfs(g, i, j+1); dfs(g, i, j-1);
}
```

### Q153. Climbing Stairs / Coin Change (DP)
```java
// Climbing stairs – O(n)/O(1)
public int climbStairs(int n) {
    int a = 1, b = 1;
    for (int i = 2; i <= n; i++) { int t = a + b; a = b; b = t; }
    return b;
}
// Coin change (min coins) – O(amount * coins)/O(amount)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
```

### Q154. LRU Cache (design) – O(1) get/put
**Idea:** HashMap + doubly linked list; or Java's `LinkedHashMap` with access-order.
```java
class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int cap;
    LRUCache(int cap) { super(cap, 0.75f, true); this.cap = cap; }
    public int get(int k) { return super.getOrDefault(k, -1); }
    public void put(int k, int v) { super.put(k, v); }
    @Override protected boolean removeEldestEntry(Map.Entry<Integer, Integer> e) { return size() > cap; }
}
```
(Interviewers often ask you to implement the doubly-linked-list version manually. Practise it.)

### Q155. Group Anagrams / Valid Anagram
```java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> m = new HashMap<>();
    for (String s : strs) {
        char[] c = s.toCharArray(); Arrays.sort(c);
        m.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(m.values());
}
```
O(n·k log k).

### Q156. Course Schedule (cycle detection / topological sort, Kahn's)
```java
public boolean canFinish(int n, int[][] pre) {
    List<List<Integer>> g = new ArrayList<>();
    int[] indeg = new int[n];
    for (int i = 0; i < n; i++) g.add(new ArrayList<>());
    for (int[] p : pre) { g.get(p[1]).add(p[0]); indeg[p[0]]++; }
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
    int done = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); done++;
        for (int v : g.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return done == n;
}
```

### Q157. Reverse a string / check palindrome / FizzBuzz / swap w/o temp (quick fire)
```java
boolean isPal(String s){ int i=0,j=s.length()-1; while(i<j) if(s.charAt(i++)!=s.charAt(j--)) return false; return true; }
a = a + b; b = a - b; a = a - b;   // swap without temp (watch overflow)
```

### Q158. Find the missing number / duplicate in array
**Answer:** Missing in `0..n`: `expected = n(n+1)/2 - sum`, or XOR all indices and values. Duplicate (Floyd's cycle on index mapping) in O(n)/O(1).

### Q159. Move zeroes / Two pointers pattern
```java
public void moveZeroes(int[] a) {
    int j = 0;
    for (int i = 0; i < a.length; i++)
        if (a[i] != 0) { int t = a[i]; a[i] = a[j]; a[j++] = t; }
}
```

### Q160. How do you prepare for DSA? (They'll ask because LeetCode badges are on your resume.)
**Answer:** "I follow patterns – sliding window, two pointers, hashing, binary search, trees/graphs, DP – rather than random problems. I solve daily in Java, review my wrong attempts, and revisit problems after a week. The LeetCode streak badges reflect consistency; what matters to me is that I can explain the *why* behind an approach and its complexity." 

> Be ready to say your approximate solved count and your comfort level (Easy/Medium/Hard) truthfully.

---

# ROUND 13 – Core CS (OS, DBMS, Networks)

### Q161. Process vs thread?
**Answer:** Process – independent program instance with its own address space. Thread – lightweight unit inside a process sharing heap/code/data, with its own stack and registers. Context switch between threads is cheaper; a thread crash can bring down the process.

### Q162. Deadlock – conditions and prevention.
**Answer:** Mutual exclusion, hold-and-wait, no preemption, circular wait. Break any one: lock ordering, acquire all-or-none, timeouts, deadlock detection (resource-allocation graph), Banker's algorithm for avoidance.

### Q163. Mutex vs semaphore; race condition?
**Answer:** Mutex – one owner, locks/unlocks (binary exclusivity). Semaphore – counter permitting N concurrent accesses (signalling). Race condition – outcome depends on timing of unsynchronised access to shared state.

### Q164. Paging, virtual memory, thrashing?
**Answer:** Memory divided into fixed-size pages; virtual memory maps virtual → physical addresses via page tables (TLB caches translations); pages swapped to disk when RAM is short. Thrashing = constant swapping, little useful work. Page replacement: FIFO, LRU, Optimal.

### Q165. CPU scheduling algorithms?
**Answer:** FCFS, SJF (optimal avg wait, starvation risk), Round Robin (time quantum), Priority (aging fixes starvation), Multilevel Queue.

### Q166. TCP vs UDP?
**Answer:** TCP – connection-oriented, reliable, ordered, flow/congestion control (HTTP, email). UDP – connectionless, no guarantees, low latency (DNS, video streaming, gaming). TCP 3-way handshake: SYN → SYN-ACK → ACK.

### Q167. What happens when you type a URL and press Enter?
**Answer:** (1) Browser checks cache; (2) DNS resolution (browser → OS → resolver → root/TLD/authoritative); (3) TCP handshake; (4) TLS handshake (HTTPS); (5) HTTP request; (6) server/load balancer/app/DB processes; (7) response; (8) browser parses HTML → builds DOM/CSSOM → render tree → layout → paint; fetches JS/CSS/images; JS executes.

### Q168. HTTP/1.1 vs HTTP/2 vs HTTP/3; HTTP vs HTTPS; GET vs POST; cookies vs localStorage vs sessionStorage?
**Answer:** HTTP/2 – multiplexing, header compression, server push. HTTP/3 – over QUIC (UDP), avoids head-of-line blocking. HTTPS = HTTP over TLS. GET is idempotent/cacheable, params in URL; POST has a body, not idempotent. Cookies (~4 KB, sent on every request, can be httpOnly), localStorage (~5–10 MB, persistent, JS-accessible), sessionStorage (per tab).

### Q169. DNS, CDN, load balancer, reverse proxy – one line each.
**Answer:** DNS – name → IP. CDN – edge servers caching static content near users. Load balancer – distributes traffic (round robin, least connections) and health-checks. Reverse proxy (Nginx) – sits in front of servers: TLS termination, caching, routing, compression.

### Q170. DBMS: primary key vs foreign key vs unique key; clustered vs non-clustered index; DELETE vs TRUNCATE vs DROP; isolation levels.
**Answer:** PK uniquely identifies a row (not null). FK references another table's key (referential integrity). Unique – unique but allows one null. Clustered index orders physical data (one per table); non-clustered stores pointers. DELETE (DML, rollback-able, WHERE) vs TRUNCATE (DDL, removes all rows quickly) vs DROP (removes table). Isolation levels: Read Uncommitted → Read Committed → Repeatable Read → Serializable; anomalies: dirty read, non-repeatable read, phantom read.

---

# ROUND 14 – Cloud (AWS), Cybersecurity, DevOps Tools

### Q171. (AWS Cloud Practitioner) Explain IaaS, PaaS, SaaS and core AWS services.
**Answer:** IaaS (EC2), PaaS (Elastic Beanstalk), SaaS (Gmail). Core: **EC2** (virtual servers), **S3** (object storage), **RDS** (managed SQL), **DynamoDB** (NoSQL), **Lambda** (serverless), **VPC** (private network), **IAM** (users/roles/policies), **CloudFront** (CDN), **Route 53** (DNS), **CloudWatch** (monitoring), **ELB** (load balancing), **SQS/SNS** (queue/pub-sub).

### Q172. Where would you deploy AurixCareer on AWS?
**Answer:** Frontend: build with Vite → S3 + CloudFront. Backend: EC2/ECS (or Elastic Beanstalk) behind an ALB, Auto Scaling. DB: RDS (PostgreSQL/MySQL). Files: S3. Secrets: Secrets Manager. Logs/metrics: CloudWatch. Use IAM roles (least privilege), security groups, HTTPS via ACM.

### Q173. What is the shared responsibility model? Principle of least privilege?
**Answer:** AWS secures the cloud (hardware, facilities, managed-service infra); the customer secures what's *in* the cloud (data, IAM, OS patching on EC2, app config). Least privilege = grant only permissions required.

### Q174. (Cisco Cybersecurity Fundamentals) CIA triad, common attacks and defences?
**Answer:** **Confidentiality, Integrity, Availability.** Attacks: phishing, malware/ransomware, DDoS, MITM, brute force, SQLi, XSS. Defences: MFA, encryption (at rest/in transit), firewalls/IDS, patching, backups, least privilege, security awareness. Symmetric (AES, fast, shared key) vs asymmetric (RSA, key pair); hashing (SHA-256) is one-way.

### Q175. Docker/CI-CD (if asked, as you list DevOps tools)
**Answer:** Docker packages app + dependencies into an image; containers are isolated, lightweight processes.
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```
CI/CD (GitHub Actions): on push → install → lint → test → build → deploy.

### Q176. Git: merge vs rebase; resolve a conflict; common commands.
**Answer:** `merge` preserves history with a merge commit; `rebase` rewrites commits onto a new base for linear history (don't rebase shared branches). Flow: `git checkout -b feature` → commit → `git pull --rebase` → push → PR → review → merge. Conflicts: edit markers `<<<<<<<`, choose/merge, `git add`, `git rebase --continue`/commit. Know `stash`, `cherry-pick`, `reset --soft/--hard`, `revert`, `reflog`.

### Q177. npm, Postman, VS Code – what do you use them for in practice?
**Answer:** npm – dependency management (`package.json`, `package-lock.json`, semantic versioning `^1.2.3`, `npm ci` for reproducible installs). Postman – API testing, collections, environments, automated tests. VS Code – debugging with breakpoints, ESLint/Prettier extensions.

---

# ROUND 15 – Testing, Performance, Agile

### Q178. You list "Unit Testing". What have you written and with which tools?
**Answer:** Frontend: **Jest + React Testing Library** (render, query by role/text, simulate user events, assert DOM). Backend: **Jest/Mocha + Supertest** for API tests, mocking the DB/external APIs. Java: **JUnit 5 + Mockito**.
```js
test('shows error on invalid login', async () => {
  render(<Login />);
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});
```
> Be honest about your coverage level: it's much better to say "I've written component and API tests for key flows" than to over-claim.

### Q179. Testing pyramid; unit vs integration vs E2E; TDD; mocks vs stubs?
**Answer:** Many fast **unit** tests, fewer **integration** tests, few **E2E** (Cypress/Playwright). TDD: red → green → refactor. **Stub** returns canned data; **mock** also verifies interactions; **spy** records calls. Good tests are deterministic, isolated, and fast.

### Q180. Web Performance Optimization – what techniques did you apply?
**Answer:** Code splitting & lazy loading, image optimisation (WebP, `loading="lazy"`, responsive `srcset`), minification/tree shaking (Vite/Webpack), compression (gzip/brotli), CDN & caching headers, debouncing, memoisation, virtualised lists, avoiding layout thrash, reducing render-blocking JS/CSS, preconnect/preload. **Metrics:** Core Web Vitals – LCP (<2.5 s), INP (<200 ms), CLS (<0.1); measure with Lighthouse/DevTools.

### Q181. How do you debug a slow API?
**Answer:** Measure first (logs/APM/timing), check DB (`EXPLAIN`, missing indexes, N+1), network calls, payload size (pagination/projection), caching (Redis), synchronous heavy work (move to queue/worker), and concurrency limits. Then re-measure.

### Q182. Caching strategies?
**Answer:** Browser cache (Cache-Control/ETag), CDN, application cache (Redis) with **cache-aside** (read: check cache → miss → DB → populate), write-through, write-back; TTL and invalidation ("the two hard problems"). Mind cache stampede.

---

# ROUND 16 – System Design

### Q183. Design a URL Shortener.
**Answer:**
- **Requirements:** shorten URL, redirect, optional custom alias/expiry, analytics; high read:write ratio (~100:1); low latency.
- **API:** `POST /shorten {url}` → `{shortUrl}`; `GET /{code}` → `301/302` redirect.
- **ID generation:** base62 of an auto-increment/distributed ID (7 chars ≈ 62⁷ ≈ 3.5 trillion), or counter ranges per server (Snowflake/ZooKeeper), avoiding hash collisions.
- **Storage:** key-value/NoSQL (`code → longUrl, createdAt, expiry, userId`); index on code.
- **Read path:** Redis cache (LRU) → DB; CDN for hot links.
- **Scale:** stateless servers behind a load balancer, shard by code, replicate DB, async analytics via queue.
- **Trade-offs:** 301 (cached by browsers; less analytics) vs 302; abuse protection (rate limits, malicious URL check).

### Q184. Design a real-time Notification System (relevant to your project).
**Answer:** Services publish events (application status changed) to a **message queue** (Kafka/RabbitMQ/SQS). A notification service consumes, stores notifications in DB (for history/unread count), and pushes to online users via **WebSocket (Socket.io + Redis adapter)**; offline users get email/push. Include templates, user preferences, retries with exponential backoff, idempotency keys, and a dead-letter queue.

### Q185. Design a Chat application.
**Answer:** WebSocket gateways (stateless, Redis pub/sub or Kafka to fan out across nodes), message service persists to DB (partition by `conversationId`, sorted by time/ID), presence via heartbeat in Redis, delivery states (sent/delivered/read) with acks, offline messages synced on reconnect via last-seen ID, media in S3, pagination by cursor. Group chats: fan-out on write for small groups, on read for huge ones.

### Q186. Design a Job Portal at scale (AurixCareer v2).
**Answer:** Microservice-ish modules: Auth, Profile, Job, Application, Assessment, Notification, AI. Relational DB (PostgreSQL) for core entities with read replicas; **Elasticsearch/OpenSearch** for job search and filtering (full-text, skills, location); Redis for caching and rate limiting; queue for async tasks (resume parsing, AI guidance, email); S3 for resumes; matching via skill overlap + embeddings (vector DB); CDN for static; observability and CI/CD. Discuss consistency between DB and search index (CDC/outbox pattern).

### Q187. How do you design a rate limiter?
**Answer:** Algorithms: fixed window, sliding window log/counter, **token bucket** (allows bursts), leaky bucket. Implement with Redis (`INCR` + `EXPIRE` or Lua script for atomicity), keyed by user/IP/API key; return **429** with `Retry-After`. Distributed consistency via a central Redis.

### Q188. Monolith vs microservices?
**Answer:** Monolith – simple to build/deploy/debug; scales as a unit; good for early stage. Microservices – independent deploy/scale and team autonomy; but add network latency, distributed data consistency, observability and ops overhead. Start with a well-structured monolith ("modular monolith"), split when needed.

### Q189. Horizontal vs vertical scaling; stateless services; message queues – why?
**Answer:** Vertical = bigger machine (limit/single point of failure). Horizontal = more machines (needs stateless design). Queues decouple producers/consumers, absorb spikes, and enable retries.

### Q190. How would you make your API idempotent (e.g., payment/apply)?
**Answer:** Client sends an `Idempotency-Key`; server stores key + response and returns the saved result on retries. Natural idempotence via unique constraints and PUT semantics.

---

# ROUND 17 – Behavioural / HR (use STAR: Situation, Task, Action, Result)

### Q191. Tell me about a time you faced a difficult technical problem.
**Sample:** *S:* Socket notifications weren't reaching users after refresh. *T:* Fix reliability before demo. *A:* Debugged with logs, found rooms were joined before auth finished and reconnects didn't rejoin; moved join into the authenticated `connection` handler, re-authenticated on reconnect, and persisted notifications in DB for catch-up. *R:* Notifications became reliable and I learned never to treat real-time channels as the only source of truth.

### Q192. Tell me about a time you disagreed with a teammate.
**Sample:** Discuss technical options with data (benchmarks/trade-offs), listen first, agree on a time-boxed experiment, commit to the outcome. Focus on the problem, not people.

### Q193. How do you handle tight deadlines?
**Answer:** Clarify priority, define an MVP, break into tasks, communicate risks early, cut scope not quality on core flows, and review afterwards.

### Q194. Describe a failure and what you learned.
**Answer:** Pick a real, low-stakes one (e.g., skipped input validation and a bad payload crashed an endpoint). Show ownership, the fix, and the process change (validation layer, tests).

### Q195. How do you keep learning?
**Answer:** Build projects, read docs and engineering blogs, DSA practice, certifications (AWS, Cisco), open-source reading, and explaining concepts to peers.

### Q196. Where do you see yourself in 3–5 years?
**Answer:** A strong engineer owning features end-to-end, mentoring juniors, comfortable with system design and cloud, growing toward a senior role/tech-lead in a product team.

### Q197. Why should we hire you?
**Answer:** "I have a solid DSA base, I've built and shipped full-stack projects end-to-end, I've worked with AI integrations in an internship, and I learn fast and take ownership. I'll bring fundamentals plus the ability to deliver."

### Q198. Are you willing to relocate / work in shifts / what are your salary expectations?
**Answer:** Be flexible and honest: "Yes, I'm open to relocation. For compensation I'd like to learn the band for this role; I'm focused on growth and fair market pay for a fresher SDE."

### Q199. You're a Bihar-based student studying in Gujarat – why this company/city?
**Answer:** Focus on the company's product/tech/culture and learning opportunities, not the location. Research the company beforehand and mention a specific product, tech stack, or engineering blog post.

---

# ROUND 18 – Resume Red-Flag Questions (Interviewers love these)

### Q200. "Redux (basic)", "MySQL (basic)", "Figma (basic)" – what does 'basic' mean?
**Answer:** Define it concretely: "Basic Redux = I understand store/actions/reducers/Toolkit slices and have used them in a small app; I haven't designed large-scale middleware setups." For MySQL: joins, group by, indexes, simple schema design. For Figma: reading designs and building simple wireframes. *Honest scoping builds credibility.*

### Q201. Your email on the resume is `kamlakant.kumar@email.com`; GitHub/LinkedIn present – anything else to see?
**Fix before applying:** Use your real email, make sure LinkedIn/GitHub links are clickable and that the repos have README files, screenshots, setup instructions, and live demo links. Pin your best two repos.

### Q202. You mention "Unit Testing" and "Web Performance Optimization" under skills but not in projects. Show evidence.
**Answer:** Be ready to point to test files in a repo or a Lighthouse before/after report. If you have none, add a small test suite to AurixCareer and record a Lighthouse score improvement – then you can speak with proof.

### Q203. "Production-quality" – is AurixCareer deployed? Who uses it?
**Answer:** Be truthful: if it's deployed (Vercel/Render/AWS) share the link, users and monitoring; if it's a portfolio project, say it's built to production-style practices (auth, validation, structured code) but not at real traffic. Deploying it is highly recommended before interviews.

### Q204. Your internship is only about a month (Jun–Jul 2026). What was your measurable contribution?
**Answer:** Name features, tech, and impact (e.g., "built the AI summarisation endpoint and chat UI, reduced response time using streaming"). Mention that it was short, but you delivered X and learned Y.

### Q205. "Java Programming (Udemy)" – and "Cybersecurity Fundamentals (Cisco)" – what did you learn that you actually use?
**Answer:** Tie each certificate to a concrete practice: Java → collections, OOP in DSA; Cisco → hashing/JWT/XSS awareness in your apps; AWS → deployment architecture knowledge.

### Q206. Your resume says "scalable" applications. What did you do for scalability?
**Answer:** Stateless API, pagination, DB indexes, separation of concerns, lazy-loaded frontend, JWT for horizontal scaling. Be ready to explain what *would* be needed for 1M users (caching, queues, read replicas, CDN, load balancing).

### Q207. Class XII PCM & CBSE, B.Tech 2023–2027 – any backlogs? CGPA?
**Answer:** Know your CGPA and be upfront about any backlogs. Add CGPA to the resume if it's good (≥ 7.5/8.0).

---

# 19. Questions YOU Should Ask the Interviewer
1. What does the onboarding and mentorship process look like for new SDEs?
2. What tech stack and architecture does the team work with, and what are the biggest technical challenges right now?
3. How do you handle code reviews, testing, and CI/CD?
4. What does success look like in the first 6 months?
5. How are engineering decisions made, and how much ownership do juniors get?
6. What learning opportunities (tech talks, budgets, rotations) are available?

---

# 20. Final Preparation Checklist

**Resume & profile**
- [ ] Replace placeholder email; verify LinkedIn/GitHub/LeetCode links work
- [ ] Add live demo links and README screenshots to both projects
- [ ] Be able to justify every number (e.g., "~40%") with a method

**Projects (most important)**
- [ ] Draw the architecture of both projects from memory
- [ ] Know every API route, DB schema and auth flow
- [ ] Prepare 3 challenges + solutions per project
- [ ] Add tests, validation, rate limiting, and deploy (even to free tiers)

**Technical**
- [ ] JavaScript: closures, event loop, promises, `this`, prototypes
- [ ] React: hooks, rendering, performance, state management
- [ ] Node/Express: middleware, errors, security, scaling
- [ ] DB: indexing, aggregation, SQL joins, transactions, N+1
- [ ] Java: OOP, collections internals, multithreading basics, streams
- [ ] DSA: ~150 problems across arrays, strings, hashing, two pointers, sliding window, trees, graphs, heaps, DP
- [ ] System design: URL shortener, chat, notification system, rate limiter
- [ ] Core CS: OS, DBMS, CN basics

**Interview skills**
- [ ] Think aloud; clarify requirements; state complexity
- [ ] Practise mock interviews with a friend (timed)
- [ ] Prepare 5 STAR stories
- [ ] Say "I don't know, but here's how I'd find out" instead of guessing

> **Golden rule:** If it's on your resume, you must be able to explain it in depth. Depth beats breadth.

*Good luck, Kamlakant!*
