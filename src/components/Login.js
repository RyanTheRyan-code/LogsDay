import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-page">
      <div className="wood"></div>
      <div className="form-container">
        <form onSubmit={handleLogin} className="login-signup-form">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
          <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}>
            <button type="button" className="oauth-button">Login with Google</button>
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;