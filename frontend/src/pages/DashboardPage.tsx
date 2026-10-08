import { useAuth } from '../hooks/useAuth';
import { useWeightLogs } from '../hooks/useWeightLogs';
import AddWeightForm from '../components/Forms/AddWeightForm';
import WeightLogList from '../components/Dashboard/WeightLogList';
import WeightChart from '../components/Dashboard/WeightChart';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { logs, trend, isLoading, error, refresh, deleteLog } = useWeightLogs();

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
    </div>
  );
};

export default DashboardPage;
