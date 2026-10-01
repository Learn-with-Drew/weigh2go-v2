import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <h1>Weigh2Go</h1>
      <h2>Create Account</h2>
      <RegisterForm onSuccess={() => navigate('/')} />
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};