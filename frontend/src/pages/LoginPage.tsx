import { useNavigate, Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <h1>Weigh2Go</h1>
      <h2>Log In</h2>
      <LoginForm onSuccess={() => navigate('/')} />
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
