import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FoodLogList from '../../src/components/Dashboard/FoodLogList';
import { FoodLog } from '../../src/types';

const makeLog = (id: string, food_name: string, calories: number): FoodLog => ({
  id,
  user_id: 'u1',
  food_name,
  calories,
  logged_date: '2026-10-08',
  created_at: '2026-10-08T12:00:00Z',
});

describe('FoodLogList', () => {
  it('shows an empty state when there are no logs', () => {
    render(<FoodLogList logs={[]} onDelete={vi.fn()} />);
    expect(screen.getByText(/no food logged/i)).toBeInTheDocument();
  });

  it('lists each entry and the day total', () => {
    render(
      <FoodLogList
        logs={[makeLog('1', 'Oatmeal', 300), makeLog('2', 'Burrito', 850)]}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Oatmeal')).toBeInTheDocument();
    expect(screen.getByText('850 kcal')).toBeInTheDocument();
    expect(screen.getByText('1150 kcal')).toBeInTheDocument();
  });

  it('calls onDelete with the entry id', () => {
    const onDelete = vi.fn();
    render(<FoodLogList logs={[makeLog('abc', 'Oatmeal', 300)]} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete oatmeal/i }));

    expect(onDelete).toHaveBeenCalledWith('abc');
  });
});
