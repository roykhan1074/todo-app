import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Todo, Priority } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string, priority: Priority, dueDate: string) => void;
}

const PRIORITY_LABEL: Record<Priority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

function formatDueDate(dueDate: string): { label: string; overdue: boolean } {
  if (!dueDate) return { label: '', overdue: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { label: '今日', overdue: false };
  if (diff === 1) return { label: '明日', overdue: false };
  if (diff === -1) return { label: '昨日', overdue: true };
  if (diff < 0) return { label: `${Math.abs(diff)}日前`, overdue: true };
  if (diff <= 7) return { label: `${diff}日後`, overdue: false };
  const m = due.getMonth() + 1;
  const d = due.getDate();
  return { label: `${m}/${d}`, overdue: false };
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const startEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate);
    setEditing(true);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    onEdit(todo.id, editText, editPriority, editDueDate);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const { label: dueDateLabel, overdue } = formatDueDate(todo.dueDate);

  if (editing) {
    return (
      <li className={`todo-item editing priority-border-${todo.priority}`}>
        <div className="edit-row">
          <input
            ref={inputRef}
            className="edit-text-input"
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="edit-options-row">
          <select
            className={`priority-select priority-${editPriority}`}
            value={editPriority}
            onChange={e => setEditPriority(e.target.value as Priority)}
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
          <input
            className="date-input"
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={saveEdit} disabled={!editText.trim()}>保存</button>
            <button className="cancel-btn" onClick={cancelEdit}>キャンセル</button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} priority-border-${todo.priority}`}>
      <button
        className="checkbox"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        <div className="todo-meta">
          <span className={`priority-badge priority-badge-${todo.priority}`}>
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {dueDateLabel && (
            <span className={`due-date ${overdue && !todo.completed ? 'overdue' : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {dueDateLabel}
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button className="icon-btn edit-btn" onClick={startEdit} aria-label="編集">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button className="icon-btn delete-btn" onClick={() => onDelete(todo.id)} aria-label="削除">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </li>
  );
}
