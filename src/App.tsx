// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CandidateLogin from './pages/login/Candidate';
import UserLogin from './pages/login/User';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/candidate" element={<CandidateLogin />} />
        <Route path="/login/hr" element={<UserLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
