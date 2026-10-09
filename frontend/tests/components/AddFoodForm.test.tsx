import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddFoodForm from '../../src/components/Forms/AddFoodForm';
import { foodService } from '../../src/services/foodService';

vi.mock('../../src/services/foodService', () => ({
  foodService: {
    createLog: vi.fn(),
  },
}));

const fill = (name: string, calories: string) => {
  fireEvent.change(screen.getByLabelText(/food/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/calories/i), { target: { value: calories } });
};

const submit = () => fireEvent.click(screen.getByRole('button', { name: /add food/i }));

describe('AddFoodForm', () => {
  beforeEach(() => {
    vi.mocked(foodService.createLog).mockReset();
  });

  it('renders food and calories fields', () => {
    render(<AddFoodForm date="2026-10-08" onLogged={vi.fn()} />);
    expect(screen.getByLabelText(/food/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
  });

  it('logs the entry to the selected date and clears the form', async () => {
    vi.mocked(foodService.createLog).mockResolvedValueOnce({
      id: '1',
      user_id: 'u1',
      food_name: 'Chicken salad',
      calories: 450,
      logged_date: '2026-10-08',
      created_at: '2026-10-08T00:00:00Z',
    });
    const onLogged = vi.fn();
    render(<AddFoodForm date="2026-10-08" onLogged={onLogged} />);

    fill('  Chicken salad  ', '450');
    submit();

    await waitFor(() => {
      expect(foodService.createLog).toHaveBeenCalledWith({
        food_name: 'Chicken salad',
        calories: 450,
        logged_date: '2026-10-08',
      });
      expect(onLogged).toHaveBeenCalled();
    });
    expect(screen.getByLabelText(/food/i)).toHaveValue('');
    expect(screen.getByLabelText(/calories/i)).toHaveValue(null);
  });

  it('shows an error when the food name is empty', async () => {
    render(<AddFoodForm date="2026-10-08" onLogged={vi.fn()} />);

    fill('   ', '300');
    submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(/food name/i);
    expect(foodService.createLog).not.toHaveBeenCalled();
  });

  it.each([['0'], ['-50'], ['12.5'], ['']])(
    'rejects invalid calories (%s)',
    async (value) => {
      render(<AddFoodForm date="2026-10-08" onLogged={vi.fn()} />);

      fill('Toast', value);
      submit();

      expect(await screen.findByRole('alert')).toHaveTextContent(/whole number/i);
      expect(foodService.createLog).not.toHaveBeenCalled();
    }
  );

  it('shows an error if the API call fails and keeps the input', async () => {
    vi.mocked(foodService.createLog).mockRejectedValueOnce(new Error('network error'));
    const onLogged = vi.fn();
    render(<AddFoodForm date="2026-10-08" onLogged={onLogged} />);

    fill('Toast', '120');
    submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not save/i);
    expect(onLogged).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/food/i)).toHaveValue('Toast');
  });
});
