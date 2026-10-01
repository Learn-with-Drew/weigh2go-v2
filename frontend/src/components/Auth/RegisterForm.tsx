import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email, password);
      onSuccess?.();
    } catch (err) {
      setLocalError('Registration failed. That email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" aria-label="Register form">
      <div className="form-field">
        <label htmlFor="reg-email">Email</label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div className="form-field">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      {(localError || error) && (
        <p className="form-error" role="alert">
          {localError || error}
        </p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default RegisterForm;