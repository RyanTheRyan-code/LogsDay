import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Calendar from './components/CalendarPage';
import Logs from './components/Logs';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import GoogleCallback from './components/GoogleCallback';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/calendar" element={<PrivateRoute element={Calendar} />} />
            <Route path="/logs" element={<PrivateRoute element={Logs} />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
