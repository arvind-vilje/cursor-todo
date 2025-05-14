import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import './App.css';

const getToday = () => new Date().toISOString().split('T')[0];

function App() {
  // State for todos
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // For progress bars
  const today = getToday();
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

  // Add todo
  const addTodo = () => {
    if (!input.trim()) {
      setError('Task cannot be empty!');
      return;
    }
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: input,
        done: false,
        created: new Date(),
        completedAt: null,
      },
    ]);
    setInput('');
    setError('');
  };

  // Mark as done
  const markDone = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: true, completedAt: new Date() } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Filter sections
  const pending = todos.filter((t) => !t.done);
  const completed = todos.filter((t) => t.done);

  // Dashboard stats
  const total = todos.length;
  const doneCount = completed.length;
  const pendingCount = pending.length;

  // Daily/Weekly progress
  const dailyDone = completed.filter(
    (t) => t.completedAt && t.completedAt.toISOString().split('T')[0] === today
  ).length;
  const weeklyDone = completed.filter(
    (t) => t.completedAt && t.completedAt >= weekAgo
  ).length;
  const dailyTarget = 5;
  const weeklyTarget = 20;

  return (
    <div className="todo-app-root">
      <header className="todo-header">
        <h1>Todo App</h1>
        <div className="dashboard">
          <div className="dash-item total">Total: {total}</div>
          <div className="dash-item completed">Completed: {doneCount}</div>
          <div className="dash-item pending">Pending: {pendingCount}</div>
        </div>
        <div className="progress-bars">
          <div className="progress-label">Daily</div>
          <div className="progress-bar">
            <div
              className="progress-fill daily"
              style={{ width: `${Math.min((dailyDone / dailyTarget) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="progress-label">Weekly</div>
          <div className="progress-bar">
            <div
              className="progress-fill weekly"
              style={{ width: `${Math.min((weeklyDone / weeklyTarget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </header>
      <main className="todo-main">
        <section className="add-section">
          <input
            className="todo-input"
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="add-btn" onClick={addTodo} title="Add Task">
            <FaPlus />
          </button>
        </section>
        {error && <div className="error-msg">{error}</div>}
        <div className="sections-container">
          <section className="pending-section">
            <h2>Pending Tasks</h2>
            {pending.length === 0 && <div className="empty-msg">No pending tasks!</div>}
            <ul className="todo-list">
              {pending.map((todo) => (
                <li key={todo.id} className="todo-item pending-task">
                  <span>{todo.text}</span>
                  <div className="actions">
                    <button
                      className="done-btn"
                      title="Mark as Done"
                      onClick={() => markDone(todo.id)}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section className="completed-section">
            <h2>Completed Tasks</h2>
            {completed.length === 0 && <div className="empty-msg">No completed tasks yet!</div>}
            <ul className="todo-list">
              {completed.map((todo) => (
                <li key={todo.id} className="todo-item completed-task">
                  <span>{todo.text}</span>
                  <div className="actions">
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
