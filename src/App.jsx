import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import MyState from "../src/context/myState";
import AdminLogin from "../src/components/pages/admin/login/AdminLogin.jsx"
import SignUp from "../src/components/pages/admin/signup/SignUp.jsx"

import Navbar from "../src/components/navbar/navbar.jsx"
import NoPage from "../src/components/pages/nopage/nopage.jsx";
import ProtectedRouteForAdmin from "./components/pages/admin/login/ProtectedRouteForAdmin.jsx";
import { Toaster } from "react-hot-toast";
import Dashboard from "../src/components/pages/dashboard/Dashboard.jsx";
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={
          <ProtectedRouteForAdmin>
            <Dashboard />
          </ProtectedRouteForAdmin>
        } />
        <Route path="/*" element={<NoPage />} />
      </Routes>
      <Toaster />
    </Router>

  );

}

export default App

