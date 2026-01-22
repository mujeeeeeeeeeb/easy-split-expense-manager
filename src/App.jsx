import Navbar from "./components/Navbar";
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}
  

export default App;