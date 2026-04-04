import { FilterStatus, Todo } from '../types';

interface Props {
  filter: FilterStatus;
  onChange: (filter: FilterStatus) => void;
  todos: Todo[];
}

export function FilterBar({ filter, onChange, todos }: Props) {
  const allCount = todos.length;
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const tabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'すべて', count: allCount },
    { key: 'active', label: '未完了', count: activeCount },
    { key: 'completed', label: '完了済み', count: completedCount },
  ];

  return (
    <div className="filter-bar">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`filter-btn ${filter === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          <span className="filter-count">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
