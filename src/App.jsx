import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
    <div style={{ padding: "20px", fontFamily: "Arial"}}>
      <h1>EasySplit</h1>
      <p>Smart group expense splitting made simple.</p>
      <Navbar />
      <Routes>
  <Route path="/" element={<Login />} />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/groups"
    element={
      <ProtectedRoute>
        <Groups />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
</Routes>

    </div>
    </BrowserRouter>
  );
}
  

export default App;