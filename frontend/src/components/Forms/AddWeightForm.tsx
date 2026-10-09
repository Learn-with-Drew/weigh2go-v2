import { FormEvent, useState } from 'react';
import { weightService } from '../../services/weightService';
import { todayLocal } from '../../utils/date';

interface AddWeightFormProps {
  onLogged: () => void;
}

const AddWeightForm = ({ onLogged }: AddWeightFormProps) => {
  const [weight, setWeight] = useState('');
  const [loggedDate, setLoggedDate] = useState(todayLocal());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Enter a valid weight.');
      return;
    }

    setIsSubmitting(true);
    try {
      await weightService.createLog({ weight: parsedWeight, logged_date: loggedDate });
      setWeight('');
      setLoggedDate(todayLocal());
      onLogged();
    } catch (err) {
      setError('Could not save weight log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-weight-form" noValidate>
      <div className="form-field">
        <label htmlFor="weight">Weight</label>
        <input
          id="weight"
          type="number"
          step="0.1"
          min="0"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 180.5"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="logged-date">Date</label>
        <input
          id="logged-date"
          type="date"
          value={loggedDate}
          onChange={(e) => setLoggedDate(e.target.value)}
          max={todayLocal()}
          required
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Log Weight'}
      </button>
    </form>
  );
};

export default AddWeightForm;