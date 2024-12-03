import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="NavBar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">LogsDay</Link>
        </div>
        <ul className="nav-links">
          {token ? (
            <>
              <li><Link to="/calendar">Calendar</Link></li>
              <li><Link to="/">Logs</Link></li>
              <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li className="signup-link"><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;