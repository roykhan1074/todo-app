import { useState } from 'react';
import { FilterStatus, Priority } from './types';
import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { FilterBar } from './components/FilterBar';

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<FilterStatus>('all');

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pd !== 0) return pd;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.createdAt - a.createdAt;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  const handleAdd = (text: string, priority: Priority, dueDate: string) => {
    addTodo(text, priority, dueDate);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </span>
          <h1>ToDoアプリ</h1>
        </div>
        <div className="header-stats">
          {activeCount > 0
            ? <><strong>{activeCount}</strong> 件のタスクが残っています</>
            : todos.length > 0
              ? 'すべて完了！'
              : 'タスクを追加しましょう'}
        </div>
      </header>

      <main className="app-main">
        <div className="card">
          <TodoInput onAdd={handleAdd} />
        </div>

        <FilterBar filter={filter} onChange={setFilter} todos={todos} />

        {sorted.length === 0 ? (
          <div className="empty-state">
            {filter === 'completed'
              ? <><span className="empty-icon">🎯</span><p>完了済みのタスクはありません</p></>
              : filter === 'active'
                ? <><span className="empty-icon">✨</span><p>未完了のタスクはありません</p></>
                : <><span className="empty-icon">📋</span><p>タスクを追加してみましょう</p></>
            }
          </div>
        ) : (
          <ul className="todo-list">
            {sorted.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}

        {hasCompleted && (
          <div className="footer">
            <button className="clear-btn" onClick={clearCompleted}>
              完了済みを削除
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
