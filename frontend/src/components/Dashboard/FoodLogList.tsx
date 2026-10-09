import { FoodLog } from '../../types';

interface FoodLogListProps {
  logs: FoodLog[];
  onDelete: (id: string) => void;
}

const FoodLogList = ({ logs, onDelete }: FoodLogListProps) => {
  if (logs.length === 0) {
    return <p className="empty-state">No food logged for this day yet.</p>;
  }

  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <div>
      <ul className="food-log-list" aria-label="Food logged for the selected day">
        {logs.map((log) => (
          <li key={log.id} className="food-log-item">
            <span className="food-log-name">{log.food_name}</span>
            <span className="food-log-calories">{log.calories} kcal</span>
            <button
              type="button"
              className="delete-button"
              onClick={() => onDelete(log.id)}
              aria-label={`Delete ${log.food_name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p className="food-total">
        Total: <strong>{totalCalories} kcal</strong>
      </p>
    </div>
  );
};

export default FoodLogList;
