import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Toast from "./components/toast/Toast";
import HomePage from "./pages/HomePage";
import EditorPage from "./pages/EditorPage";
import Login from "./login";
import SignUp from "./signup";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
        Checking user...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Redirect root based on login status */}
        <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />

        {/* Auth routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/home" />} />

        {/* Protected routes */}
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/editor/:roomId" element={user ? <EditorPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toast />
    </Router>
  );
};

export default App;
