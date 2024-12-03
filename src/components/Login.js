import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginSignup.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // check if google auth failed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error === 'oauth_failed') {
      setError('Google login failed. Please try again or use email login.');
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // hit the backend to log in
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // we're in! save the token n go home
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong, try again?');
    }
  };

  const handleGoogleLogin = () => {
    // bounce to google oauth
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="form-page">
      <div className="wood"></div>
      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin} className="login-signup-form">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          <button type="submit">Login</button>
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            className="oauth-button"
          >
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;