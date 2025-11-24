import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Employee from './pages/Employee';
import AddEmployee from './pages/AddEmployee';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Simple header navigation (no CSS) */}
        <header>
          <nav>
            <Link to="/add">Add Employee</Link>
            {' | '}
            <Link to="/employees">Employee List</Link>
          </nav>
          <hr />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<AddEmployee />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
