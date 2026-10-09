import { FormEvent, useState } from 'react';
import { foodService } from '../../services/foodService';

interface AddFoodFormProps {
  /** The date (YYYY-MM-DD) the entry will be logged to. */
  date: string;
  onLogged: () => void;
}

const AddFoodForm = ({ date, onLogged }: AddFoodFormProps) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = foodName.trim();
    if (!name) {
      setError('Enter a food name.');
      return;
    }

    const parsedCalories = Number(calories);
    if (calories.trim() === '' || !Number.isInteger(parsedCalories) || parsedCalories <= 0) {
      setError('Enter calories as a whole number greater than 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      await foodService.createLog({
        food_name: name,
        calories: parsedCalories,
        logged_date: date,
      });
      setFoodName('');
      setCalories('');
      onLogged();
    } catch (err) {
      setError('Could not save food log. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-food-form" noValidate>
      <div className="form-field">
        <label htmlFor="food-name">Food</label>
        <input
          id="food-name"
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="e.g. Chicken salad"
          maxLength={255}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="food-calories">Calories</label>
        <input
          id="food-calories"
          type="number"
          step="1"
          min="1"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="e.g. 450"
          required
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Food'}
      </button>
    </form>
  );
};

export default AddFoodForm;
