import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import UserHome from './components/UserHome';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import SignupForm from './components/SignupForm';
import Scores from './components/Scores';
import './styles/styles.css';
import Typing from './components/Typing';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path='/signup' element={<SignupForm/>}></Route>
          <Route path="/userhome" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />
          <Route path="/typing" element={<ProtectedRoute><Typing /></ProtectedRoute>} />
          <Route path="/scores" element={<ProtectedRoute><Scores /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
