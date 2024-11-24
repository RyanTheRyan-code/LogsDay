import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    } else {
      console.error('No token found in URL');
      navigate('/login');
    }
  }, [navigate, location]);

  return null; // This component doesn't render anything
}

export default GoogleCallback;
