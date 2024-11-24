import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="form-page">
      <div className="wood"></div>
      <div className="form-container">
        <form onSubmit={handleSignup} className="login-signup-form">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Signup</button>
          <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}>
            <button type="button" className="oauth-button">Sign Up with Google</button>
          </a>
        </form>
      </div>
    </div>
  );
};

export default Signup;