import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddWeightForm from '../../src/components/Forms/AddWeightForm';
import { weightService } from '../../src/services/weightService';

vi.mock('../../services/weightService', () => ({
  weightService: {
    createLog: vi.fn(),
  },
}));

describe('AddWeightForm', () => {
  beforeEach(() => {
    vi.mocked(weightService.createLog).mockReset();
  });

  it('renders weight and date fields', () => {
    render(<AddWeightForm onLogged={vi.fn()} />);
    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('submits a valid weight log', async () => {
    vi.mocked(weightService.createLog).mockResolvedValueOnce({
      id: '1',
      user_id: 'u1',
      weight: 180.5,
      logged_date: '2026-01-01',
      created_at: '2026-01-01T00:00:00Z',
    });
    const onLogged = vi.fn();
    render(<AddWeightForm onLogged={onLogged} />);

    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '180.5' } });
    fireEvent.click(screen.getByRole('button', { name: /log weight/i }));

    await waitFor(() => {
      expect(weightService.createLog).toHaveBeenCalledWith(
        expect.objectContaining({ weight: 180.5 })
      );
      expect(onLogged).toHaveBeenCalled();
    });
  });

  it('shows a validation error for an invalid weight', async () => {
    render(<AddWeightForm onLogged={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '-5' } });
    fireEvent.click(screen.getByRole('button', { name: /log weight/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(weightService.createLog).not.toHaveBeenCalled();
  });

  it('shows an error if the API call fails', async () => {
    vi.mocked(weightService.createLog).mockRejectedValueOnce(new Error('network error'));
    render(<AddWeightForm onLogged={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '180' } });
    fireEvent.click(screen.getByRole('button', { name: /log weight/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});