import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      navigate('/');
    } else if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
    } else {
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Processing login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default GoogleCallback;
