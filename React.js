# React Notes for Freshers (Placement & Interview Guide)

> Built from your own notes (components, JSX, state, hooks, props, tic-tac-toe) and extended with what interviewers commonly ask freshers.

---

## Table of Contents

1. [What is React?](#1-what-is-react)
2. [JSX](#2-jsx)
3. [Components](#3-components)
4. [Props](#4-props)
5. [State](#5-state)
6. [Hooks](#6-hooks)
7. [Practice Project: Tic-Tac-Toe](#7-practice-project-tic-tac-toe)
8. [Lists and Keys](#8-lists-and-keys)
9. [Conditional Rendering](#9-conditional-rendering)
10. [Handling Events](#10-handling-events)
11. [useEffect Basics](#11-useeffect-basics)
12. [Controlled Inputs (Forms)](#12-controlled-inputs-forms)
13. [Lifting State Up](#13-lifting-state-up)
14. [Virtual DOM](#14-virtual-dom)
15. [Top Interview Questions & Answers](#15-top-interview-questions--answers)
16. [Common Mistakes](#16-common-mistakes)
17. [Quick Revision Cheat Sheet](#17-quick-revision-cheat-sheet)

---

## 1. What is React?

React is a **JavaScript library** (not a full framework) for building **user interfaces**, created by Meta (Facebook).

**Why React?**
- **Component-based**: build small reusable pieces, combine them into big UIs.
- **Declarative**: you describe *what* the UI should look like; React figures out *how* to update it.
- **Fast updates**: uses the Virtual DOM to update only what changed.
- **Huge ecosystem and job market**.

---

## 2. JSX

> A **JSX element** is a combination of JavaScript code and HTML-like tags that describes what you'd like to display.

```jsx
const element = <h1>Hello, React!</h1>;
```

**JSX rules (frequently asked):**

| Rule | Example |
|------|---------|
| Must return **one** root element | wrap in `<div>` or Fragment `<>...</>` |
| Use `className` instead of `class` | `<div className="box">` |
| Close every tag | `<img />`, `<input />` |
| Use camelCase for attributes | `onClick`, `tabIndex` |
| JavaScript goes inside `{ }` | `<p>{name}</p>` |

```jsx
const name = "Riya";
const el = <h2>Welcome, {name}! 2 + 3 = {2 + 3}</h2>;
```

**Remember:** JSX is not HTML. The browser can't read it; tools like Babel convert it to `React.createElement(...)` calls.

---

## 3. Components

> A **component** is a piece of reusable code that represents a part of the user interface. Components are used to render, manage, and update UI elements.

**Rules**
- Component names **must start with a capital letter** (`Square`, not `square`).
- A component is a function that **returns JSX**.

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

**Line-by-line:**
- `function Square()` defines a component named Square.
- `export` makes it accessible outside this file.
- `default` marks it as the *main* thing exported from the file.
- `return <button ...>` is the UI it displays.

### Fragments

A component must return **a single JSX element**. To return several adjacent elements without adding an extra `<div>`, wrap them in a **Fragment** `<> </>`:

```jsx
export default function Squares() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

### Nesting components

```jsx
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

`<div className="board-row">` groups buttons into a row, which is how you create a board layout instead of everything appearing in one line (`XXXXXXXXX`).

---

## 4. Props

> **Props** (properties) are the built-in mechanism React uses to **pass data from a parent component to a child component**.

Key points:
- Props flow **one way**: parent → child.
- Props are **read-only**. A child must never change its own props.

```jsx
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <div className="board-row">
      <Square value="1" />
      <Square value="2" />
      <Square value="3" />
    </div>
  );
}
```

Now every `Square` shows a different value because the parent passed different props.

---

## 5. State

> If you want a component to **remember** something, add **state** to it.

Example: counting how many times a button was clicked.

```jsx
import { useState } from 'react';

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>Clicked {count} times</button>;
}
```

**Breaking down `const [count, setCount] = useState(0)`**
- `count` is the current value (the "memory").
- `setCount` is the function that updates it **and re-renders** the component.
- `0` is the initial value.

**Why not use a normal variable?** A normal variable resets on every render and changing it doesn't trigger a re-render. State persists and triggers re-rendering.

### Props vs State (very common question)

| | Props | State |
|---|---|---|
| Owned by | Parent | The component itself |
| Can the component change it? | No (read-only) | Yes (via setter) |
| Purpose | Pass data down | Remember changing data |
| Causes re-render when changed | Yes (when parent re-renders) | Yes |

### Important state rules
1. Never modify state directly: `count = 5` ❌ → `setCount(5)` ✅
2. State updates are **asynchronous/batched**. When the new value depends on the old one, use the functional form:
   ```jsx
   setCount(prev => prev + 1);
   ```
3. For objects and arrays, create a **new copy** (immutability):
   ```jsx
   setItems([...items, newItem]);
   setUser({ ...user, name: "Aman" });
   ```

---

## 6. Hooks

- Functions whose names start with `use` are called **Hooks**.
- `useState` is a built-in Hook provided by React.
- You can also write **custom Hooks** by combining existing ones.
- **Rules of Hooks:**
  1. Call Hooks only at the **top level** of a component (not inside loops, conditions, or nested functions).
  2. Call Hooks only from **React function components** or custom Hooks.

```jsx
// ❌ Wrong
if (isLoggedIn) {
  const [name, setName] = useState("");
}

// ✅ Correct
const [name, setName] = useState("");
```

**Commonly used Hooks**

| Hook | Use |
|------|-----|
| `useState` | Store changing data |
| `useEffect` | Side effects (API calls, timers, subscriptions) |
| `useRef` | Access a DOM element or keep a value without re-rendering |
| `useContext` | Share data across components without prop drilling |
| `useMemo` | Cache an expensive calculation |
| `useCallback` | Cache a function reference |
| `useReducer` | Complex state logic |

### Custom Hook example

```jsx
import { useState } from 'react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const reset = () => setCount(initial);
  return { count, increment, reset };
}
```

---

## 7. Practice Project: Tic-Tac-Toe

Great for understanding React syntax, state, props, and lifting state up. Build it step by step.

### Step 1: A single Square

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

### Step 2: Board with 9 squares (using `div` rows)

```jsx
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square /><Square /><Square />
      </div>
      <div className="board-row">
        <Square /><Square /><Square />
      </div>
      <div className="board-row">
        <Square /><Square /><Square />
      </div>
    </>
  );
}
```

### Step 3: Pass data with props and handle clicks

```jsx
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

### Step 4: Add state (in the Board, not in each Square)

```jsx
import { useState } from 'react';

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return; // ignore if filled or game over
    const next = squares.slice();            // copy (immutability!)
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? 'Winner: ' + winner
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

**What you learn from this project**
- Components and nesting
- Props (`value`, `onSquareClick`)
- State (`squares`, `xIsNext`)
- Lifting state up (state lives in `Board`, the common parent)
- Immutability (`slice()` to copy the array)
- Event handling and conditional logic

---

## 8. Lists and Keys

Use `.map()` to render lists. Each item needs a unique `key`.

```jsx
const fruits = ["Apple", "Banana", "Mango"];

function FruitList() {
  return (
    <ul>
      {fruits.map(fruit => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

**Why keys?** They help React identify which items changed, were added, or removed. Use a stable unique ID (like `item.id`). Avoid using the array index as key when the list can be reordered, added to, or deleted from.

---

## 9. Conditional Rendering

```jsx
// 1. if / else
if (isLoggedIn) return <Dashboard />;
return <Login />;

// 2. Ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// 3. Logical AND (render only if true)
{hasMessages && <Inbox />}
```

---

## 10. Handling Events

```jsx
function MyButton() {
  function handleClick() {
    alert("You clicked me!");
  }
  return <button onClick={handleClick}>Click</button>;
}
```

⚠️ Pass the function, don't call it:
- ✅ `onClick={handleClick}`
- ❌ `onClick={handleClick()}` (runs immediately on render)

To pass arguments: `onClick={() => handleClick(5)}`

---

## 11. useEffect Basics

Runs code **after render**, used for side effects such as fetching data, timers, and subscriptions.

```jsx
import { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []); // [] = run only once, after first render

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

**Dependency array behaviour**

| Dependency array | When effect runs |
|---|---|
| none | After **every** render |
| `[]` | Only **once** (on mount) |
| `[count]` | On mount and whenever `count` changes |

**Cleanup:** return a function to clean up (clear timers, remove listeners):

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);
}, []);
```

---

## 12. Controlled Inputs (Forms)

An input whose value is controlled by React state.

```jsx
function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}
```

---

## 13. Lifting State Up

When two sibling components need the same data, move the state to their **closest common parent** and pass it down via props.

```
        Parent  (owns state)
        /    \
   ChildA    ChildB   (receive data + callbacks via props)
```

This is exactly what happens in Tic-Tac-Toe: `Board` owns the state, and each `Square` receives its value and click handler.

---

## 14. Virtual DOM

- The **Virtual DOM** is a lightweight JavaScript copy of the real DOM.
- When state changes, React builds a new Virtual DOM tree and **compares** it with the previous one (this is called **diffing**, using the *reconciliation* algorithm).
- It then updates **only the changed parts** of the real DOM.
- Result: fewer slow DOM operations, so faster UI updates.

---

## 15. Top Interview Questions & Answers

**Q1. What is React?**
A JavaScript library for building user interfaces using reusable components.

**Q2. Library or framework?**
A library. It handles the view layer; routing, state management, etc. come from other libraries (React Router, Redux, and so on).

**Q3. What is JSX?**
A syntax extension that lets you write HTML-like markup inside JavaScript. It gets compiled to `React.createElement()` calls.

**Q4. What is a component? Types?**
A reusable piece of UI. Types: **function components** (modern, use Hooks) and **class components** (older).

**Q5. Difference between props and state?**
Props are passed from parent and read-only; state is owned by the component and can change via its setter, triggering re-render.

**Q6. What are Hooks?**
Functions starting with `use` that let function components use React features like state and lifecycle behaviour.

**Q7. What are the Rules of Hooks?**
Call them only at the top level, and only inside React function components or custom Hooks.

**Q8. Why can't we update state directly?**
React wouldn't know the value changed, so it wouldn't re-render. Always use the setter function.

**Q9. What is the Virtual DOM?**
A lightweight in-memory copy of the real DOM used to compute minimal updates efficiently.

**Q10. Why are keys important in lists?**
They give each list item a stable identity so React can update the list efficiently and correctly.

**Q11. What is a Fragment?**
`<> </>` lets you group multiple elements without adding an extra node to the DOM.

**Q12. What is prop drilling? How to avoid it?**
Passing props through many intermediate components that don't need them. Avoid with `useContext` or a state-management library.

**Q13. Controlled vs uncontrolled components?**
Controlled: form value is held in React state. Uncontrolled: DOM keeps the value, read via `useRef`.

**Q14. What does `useEffect` do?**
Runs side effects after render. The dependency array controls when it re-runs.

**Q15. What is lifting state up?**
Moving shared state to the closest common ancestor so multiple children can use it.

**Q16. What is `export default`?**
It marks the main export of a file, so it can be imported without curly braces: `import Square from './Square'`.

**Q17. What happens when state changes?**
React re-renders the component, computes the new Virtual DOM, diffs it, and updates only the changed real DOM nodes.

**Q18. What is conditional rendering?**
Showing different UI based on conditions, using `if`, ternary `? :`, or `&&`.

**Q19. What is `useRef`?**
Returns a mutable object that persists across renders without causing a re-render when changed. Often used to access DOM elements.

**Q20. What is `React.memo`?**
Wraps a component so it re-renders only when its props change (performance optimization).

---

## 16. Common Mistakes

| Mistake | Fix |
|---|---|
| Lowercase component name | `Square`, not `square` |
| Returning two elements without a wrapper | Use a Fragment `<>...</>` |
| `class` instead of `className` | Use `className` |
| Mutating state (`arr.push(x); setArr(arr)`) | `setArr([...arr, x])` |
| `onClick={fn()}` | `onClick={fn}` or `onClick={() => fn()}` |
| Missing `key` in `.map()` | Add a unique `key` |
| Hooks inside `if` or loops | Move to top level |
| Infinite loop in `useEffect` (setting state with no deps) | Add a correct dependency array |

---

## 17. Quick Revision Cheat Sheet

```
Component   -> function returning JSX, name starts with Capital
JSX         -> HTML-like syntax in JS, one root, className, {expressions}
Props       -> parent -> child data, read-only
State       -> component memory, useState, triggers re-render
Hook        -> function starting with "use", call at top level only
Fragment    -> <> </> groups elements without extra DOM node
Key         -> unique id for list items
Lift state  -> move shared state to the common parent
useEffect   -> side effects; [] = run once
Virtual DOM -> diff old vs new tree, update only the changes
```

### Suggested practice order (before placements)

1. Counter app (`useState`)
2. Tic-Tac-Toe (props, state, lifting state up)
3. To-Do list (lists, keys, forms)
4. API data fetch app (`useEffect`)
5. Simple multi-page app (React Router)
6. Theme toggle (`useContext`)

> **Tip:** In interviews, don't just recite definitions. Give a one-line example, like "State is like a component's memory, for example a click counter." Interviewers love this.

Good luck with your placements! 🚀
