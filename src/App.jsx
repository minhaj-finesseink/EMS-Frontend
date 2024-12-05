import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashborad";
import LandingPage from "./pages/LandingPage";
import EmployeeCreatePass from "./pages/EmployeeCreatePass";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from "./components/ResetPassword";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/setup-password/:token" element={<EmployeeCreatePass />}></Route>
        <Route path="/admin-dashboard" element={<Dashboard />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
        {/* <Route path="/new-page" element={<SignInNew/>}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
