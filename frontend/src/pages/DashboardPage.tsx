import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWeightLogs } from '../hooks/useWeightLogs';
import { useFoodLogs } from '../hooks/useFoodLogs';
import { todayLocal } from '../utils/date';
import AddWeightForm from '../components/Forms/AddWeightForm';
import AddFoodForm from '../components/Forms/AddFoodForm';
import WeightLogList from '../components/Dashboard/WeightLogList';
import WeightChart from '../components/Dashboard/WeightChart';
import FoodLogList from '../components/Dashboard/FoodLogList';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { logs, trend, isLoading, error, refresh, deleteLog } = useWeightLogs();
  const [selectedDate, setSelectedDate] = useState(todayLocal());
  const {
    logs: foodLogs,
    isLoading: foodLoading,
    error: foodError,
    refresh: refreshFood,
    deleteLog: deleteFoodLog,
  } = useFoodLogs(selectedDate);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Weigh2Go</h1>
        <div>
          <span>{user?.email}</span>
          <button type="button" onClick={() => logout()}>
            Log Out
          </button>
        </div>
      </header>

      <section>
        <h2>Log Weight</h2>
        <AddWeightForm onLogged={refresh} />
      </section>

      {error && <p className="form-error">{error}</p>}

      <section>
        <h2>Weight Trend</h2>
        {isLoading ? <p>Loading...</p> : <WeightChart trend={trend} />}
      </section>

      <section>
        <h2>Recent Logs</h2>
        {isLoading ? <p>Loading...</p> : <WeightLogList logs={logs} onDelete={deleteLog} />}
      </section>

      <section>
        <h2>Food Log</h2>
        <div className="form-field date-picker">
          <label htmlFor="food-date">Day</label>
          <input
            id="food-date"
            type="date"
            value={selectedDate}
            max={todayLocal()}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
          />
        </div>
        <AddFoodForm date={selectedDate} onLogged={refreshFood} />
        {foodError && <p className="form-error">{foodError}</p>}
        {foodLoading ? (
          <p>Loading...</p>
        ) : (
          <FoodLogList logs={foodLogs} onDelete={deleteFoodLog} />
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
