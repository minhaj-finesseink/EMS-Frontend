import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Import Toaster
import Dashboard from "./pages/Dashborad";
import LandingPage from "./pages/LandingPage";
import EmployeeCreatePass from "./pages/EmployeeCreatePass";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute/privateRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster /> {/* Toaster component to display toast messages */}
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route
          path="/setup-password/:token"
          element={<EmployeeCreatePass />}
        ></Route>
        {/* Protected Route */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
