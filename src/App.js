// main app setup - routes n stuff
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './components/CalendarPage';
import Logs from './components/Logs';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';
import GoogleCallback from './components/GoogleCallback';
import Projects from './components/Projects';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            { /* all our pages */ }
            <Route path="/" element={<Logs />} />
            <Route path="/projects/:id" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/calendar" element={<PrivateRoute element={Calendar} />} />
            { /* google auth stuff */ }
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/oauth-callback" element={<GoogleCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
