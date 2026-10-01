import { WeightLog } from '../../types';

interface WeightLogListProps {
  logs: WeightLog[];
  onDelete: (id: string) => void;
}

const WeightLogList = ({ logs, onDelete }: WeightLogListProps) => {
  if (logs.length === 0) {
    return <p className="empty-state">No weight logs yet. Add your first one above.</p>;
  }

  return (
    <ul className="weight-log-list" aria-label="Recent weight logs">
      {logs.map((log) => (
        <li key={log.id} className="weight-log-item">
          <span className="weight-log-date">{log.logged_date}</span>
          <span className="weight-log-value">{log.weight}</span>
          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(log.id)}
            aria-label={`Delete weight log for ${log.logged_date}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default WeightLogList;