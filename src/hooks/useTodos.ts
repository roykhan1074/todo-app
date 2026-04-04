import { useState, useEffect } from 'react';
import { Todo, Priority } from '../types';

const STORAGE_KEY = 'todo-app-v1';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority, dueDate: string) => {
    if (!text.trim()) return;
    setTodos(prev => [
      {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        dueDate,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const editTodo = (id: string, text: string, priority: Priority, dueDate: string) => {
    if (!text.trim()) return;
    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, text: text.trim(), priority, dueDate } : t
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.completed));
  };

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted };
}
