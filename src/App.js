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
import CreatePost from './components/CreatePost';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            { /* all our pages */ }
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Logs />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/projects/:id" element={<Projects />} />
            </Route>
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
