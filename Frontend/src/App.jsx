import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/dashboard"; // Ensure this is correctly imported
// Removed GoogleOAuthProvider; using Firebase Auth Google provider instead
import { AuthProvider, useAuth } from "./components/AuthContext";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth(); // Get user state from Auth Context
  return user ? element : <Navigate to="/login" />; // Redirect to login if not authenticated
};

const App = () => {
  return (
    <AuthProvider>
        <div className="overflow-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
          </Routes>
        </div>
    </AuthProvider>
  );
};

export default App;
