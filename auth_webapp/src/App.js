import logo from './logo.svg';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Redirect root to login (avoids "No routes matched location '/'" error) */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element={<UserProfile />} />
          {/* Fallback: redirect unknown routes to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      
      </Router>
    </div>
  );
}

export default App;