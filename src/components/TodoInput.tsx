import { useState, FormEvent } from 'react';
import { Priority } from '../types';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate: string) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate);
    setText('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <div className="input-row">
        <input
          className="text-input"
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          autoFocus
        />
        <button
          className="add-btn"
          type="submit"
          disabled={!text.trim()}
          aria-label="タスクを追加"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          追加
        </button>
      </div>
      <div className="options-row">
        <div className="priority-select-wrapper">
          <label className="option-label" htmlFor="priority-select">優先度</label>
          <select
            id="priority-select"
            className={`priority-select priority-${priority}`}
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
        <div className="date-wrapper">
          <label className="option-label" htmlFor="due-date">期限</label>
          <input
            id="due-date"
            className="date-input"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
