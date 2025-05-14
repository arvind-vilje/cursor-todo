import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaCheckCircle, FaCalendar } from 'react-icons/fa';
import Calendar from 'react-calendar';
import { format, isSameDay, isSameWeek, isToday } from 'date-fns';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/todos';

function App() {
  // State for todos and calendar
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          !event.target.closest('.calendar-toggle')) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch todos from backend on mount
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setTodos(res.data.map(todo => ({
          ...todo,
          created: todo.created ? new Date(todo.created) : new Date(),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : null,
          date: todo.date ? new Date(todo.date) : new Date(),
        })));
      });
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!input.trim()) {
      setError('Task cannot be empty!');
      return;
    }
    const newTodo = {
      text: input,
      done: false,
      created: new Date(),
      completedAt: null,
      date: selectedDate,
    };
    const res = await axios.post(API_URL, newTodo);
    setTodos([...todos, { ...res.data, date: new Date(res.data.date), created: new Date(res.data.created) }]);
    setInput('');
    setError('');
  };

  // Mark as done
  const markDone = async (id) => {
    const todo = todos.find(t => t.id === id || t._id === id);
    const updated = { ...todo, done: true, completedAt: new Date() };
    await axios.put(`${API_URL}/${id}`, updated);
    setTodos(todos.map(t => (t.id === id || t._id === id) ? { ...updated } : t));
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter(t => (t.id !== id && t._id !== id)));
  };

  // Filter todos for selected date
  const filteredTodos = todos.filter((todo) =>
    isSameDay(new Date(todo.date), selectedDate)
  );

  // Filter sections for selected date
  const pending = filteredTodos.filter((t) => !t.done);
  const completed = filteredTodos.filter((t) => t.done);

  // Dashboard stats for selected date
  const total = filteredTodos.length;
  const doneCount = completed.length;
  const pendingCount = pending.length;

  // Progress bars (daily/weekly)
  const dailyTarget = 5;
  const weeklyTarget = 20;
  const dailyDone = todos.filter(
    (t) => t.done && isToday(new Date(t.completedAt))
  ).length;
  const weeklyDone = todos.filter(
    (t) => t.done && isSameWeek(new Date(t.completedAt), new Date(), { weekStartsOn: 1 })
  ).length;

  // Get dates with tasks for calendar highlighting
  const datesWithTasks = todos.reduce((dates, todo) => {
    const date = format(new Date(todo.date), 'yyyy-MM-dd');
    dates[date] = true;
    return dates;
  }, {});

  return (
    <div className="todo-app-root">
      <header className="todo-header">
        <h1>Todo App</h1>
        <div className="calendar-section">
          <button 
            className="calendar-toggle"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <FaCalendar /> {format(selectedDate, 'MMMM d, yyyy')}
          </button>
          {showCalendar && (
            <div className="calendar-container" ref={calendarRef}>
              <Calendar
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }}
                value={selectedDate}
                tileClassName={({ date }) => {
                  return datesWithTasks[format(date, 'yyyy-MM-dd')] ? 'has-tasks' : null;
                }}
              />
            </div>
          )}
        </div>
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
                <li key={todo._id || todo.id} className="todo-item pending-task">
                  <span>{todo.text}</span>
                  <div className="actions">
                    <button
                      className="done-btn"
                      title="Mark as Done"
                      onClick={() => markDone(todo._id || todo.id)}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => deleteTodo(todo._id || todo.id)}
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
                <li key={todo._id || todo.id} className="todo-item completed-task">
                  <span>{todo.text}</span>
                  <div className="actions">
                    <button
                      className="delete-btn"
                      title="Delete"
                      onClick={() => deleteTodo(todo._id || todo.id)}
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
