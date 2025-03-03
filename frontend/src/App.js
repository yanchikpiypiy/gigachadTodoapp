import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import TodosPage from "./components/TodosPage";
import { jwtDecode } from "jwt-decode";

function App() {
  // User state holds authentication info (token and username)
  const [user, setUser] = useState(null);
  const [cred, setCred] = useState(null);

  // Check localStorage for an existing token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUser(storedToken);
        setCred(decodedToken);
      } catch (error) {
        console.error("Invalid token found in localStorage:", error);
        handleLogout(); // Clear token if it's invalid
      }
    }
  }, []);

  // Handle login success (store token and user info)
  const handleLogin = (token) => {
    localStorage.setItem("jwtToken", token); // Save token
    const decoded = jwtDecode(token);
    setUser(token);
    setCred(decoded);
  };

  // Handle logout (clear token and user state)
  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // Remove token from storage
    setUser(null);
    setCred(null);
  };

  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-900 text-white">
        {/* Header displays the app title and the logged-in username */}
        <header className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 flex items-center justify-between shadow-md">
          <h1 className="text-3xl font-bold text-white">My App</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white">Logged in as: {cred?.sub}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Main content with routes */}
        <main className="flex-1 p-4">
          <Routes>
            {/* Login route: If already logged in, redirect to /todos */}
            <Route
              path="/login"
              element={user ? <Navigate to="/todos" replace /> : <Auth onAuthSuccess={handleLogin} />}
            />

            {/* Todos route: If not logged in, redirect to /login */}
            <Route
              path="/todos"
              element={user ? <TodosPage user={user} /> : <Navigate to="/login" replace />}
            />

            {/* Catch-all: redirect based on authentication status */}
            <Route path="*" element={<Navigate to={user ? "/todos" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
