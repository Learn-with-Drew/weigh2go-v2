import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '../../src/components/Auth/RegisterForm';

const registerMock = vi.fn();
let mockError: string | null = null;

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    register: registerMock,
    error: mockError,
  }),
}));

const fill = (email: string, password: string, confirm: string) => {
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: password } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: confirm } });
};

const submit = () => fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

describe('RegisterForm', () => {
  beforeEach(() => {
    registerMock.mockReset();
    mockError = null;
  });

  it('registers with the entered credentials and calls onSuccess', async () => {
    registerMock.mockResolvedValueOnce(undefined);
    const onSuccess = vi.fn();
    render(<RegisterForm onSuccess={onSuccess} />);

    fill('new@example.com', 'securepassword123', 'securepassword123');
    submit();

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith('new@example.com', 'securepassword123');
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('blocks submission when the passwords do not match', async () => {
    render(<RegisterForm />);

    fill('new@example.com', 'securepassword123', 'differentpassword');
    submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(/do not match/i);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('shows the real error reported by useAuth (not a guess)', () => {
    mockError = 'Email already registered';
    render(<RegisterForm />);

    expect(screen.getByRole('alert')).toHaveTextContent('Email already registered');
  });

  it('does not call onSuccess when registration fails', async () => {
    registerMock.mockRejectedValueOnce(new Error('failed'));
    const onSuccess = vi.fn();
    render(<RegisterForm onSuccess={onSuccess} />);

    fill('new@example.com', 'securepassword123', 'securepassword123');
    submit();

    await waitFor(() => expect(registerMock).toHaveBeenCalled());
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
