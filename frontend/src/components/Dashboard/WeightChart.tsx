import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WeightTrendPoint } from '../../types';

interface WeightChartProps {
  trend: WeightTrendPoint[];
}

const WeightChart = ({ trend }: WeightChartProps) => {
  if (trend.length === 0) {
    return <p className="empty-state">Log a few weigh-ins to see your trend here.</p>;
  }

  const data = trend.map((point) => ({
    date: point.date,
    weight: point.average_weight,
  }));

  return (
    <div className="weight-chart" aria-label="Weight trend chart">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#646cff" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightChart;