import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CandidateLogin from './pages/login/Candidate';
import UserLogin from './pages/login/User';
import RHDashboard from './pages/rh/DashboardRH';
import CreateQuestionnaire from './pages/rh/questionnaire/CreateQuestionnaire';
import EditQuestionnaire from './pages/rh/questionnaire/[id]/edit'; // ✅ novo
import DetailsQuestionnaire from './pages/rh/questionnaire/DetailsQuestionnaire';
import CreateCandidate from './pages/rh/candidates/CreateCandidate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/candidate" element={<CandidateLogin />} />
        <Route path="/login/hr" element={<UserLogin />} />
        <Route path="/rh/dashboard" element={<RHDashboard />} />
        <Route path="/rh/questionnaires/create" element={<CreateQuestionnaire />} />
        <Route path="/rh/questionnaires/:id/edit" element={<EditQuestionnaire />} /> {/* ✅ nova rota */}
        <Route path="/rh/questionnaires/:id" element={<DetailsQuestionnaire />} /> {/* Rota para detalhes */}
        <Route path="/rh/candidates" element={<CreateCandidate />} /> {/* Nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
