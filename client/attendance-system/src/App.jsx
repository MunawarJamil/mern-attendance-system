import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lgin from "./components/Lgin";
import Regiater from "./components/Regiater";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Regiater />} />
        <Route path="/" element={<Lgin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
