import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashborad";
import LandingPage from "./pages/LandingPage";
import EmployeeCreatePass from "./pages/EmployeeCreatePass";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute/privateRoute";
import ShiftSignIn from "./modules/Shift/Sign-in";
import ShiftSignUp from "./modules/Shift/Sign-up";
import VideoSignIn from "./modules/Video-Conferencing/Sign-in";
import VideoSignUp from "./modules/Video-Conferencing/Sign-up";
import VideoDashboard from "./modules/Video-Conferencing/Dashboard";
import VideoHomeScreen from "./modules/Video-Conferencing/MeetingScreen";
// import MeetingRoom from "./modules/Video-Conferencing/MeetingLobby";
import Test from "./modules/Video-Conferencing/Test/Lobby";
import Room from "./modules/Video-Conferencing/Test/Room";
// import { VideoProvider } from "./context/VideoCallContext";
import Layout from "./modules/Video-Conferencing/Layout";
import Test1 from './modules/Video-Conferencing/new.jsx'

function App() {
  return (
    // <VideoProvider>
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
        {/* Shift Module Routes */}
        <Route path="/shift-sign-in" element={<ShiftSignIn />} />
        <Route path="/shift-sign-up" element={<ShiftSignUp />} />
        {/* Video Conferencing Routes */}
        <Route path="/video-sign-in" element={<VideoSignIn />} />
        <Route path="/video-sign-up" element={<VideoSignUp />} />
        <Route path="/video-dashboard" element={<VideoDashboard />} />
        <Route path="/meeting-room/:meetingId" element={<VideoHomeScreen />} />
        {/* <Route path="/meeting/:meetingId" element={<MeetingRoom />} /> */}
        {/* <Route path="/meeting" element={<MeetingRoom />} /> */}
        {/* video test */}
        <Route path="/lobby" element={<Test />} />
        <Route path="/room/:meetingId" element={<Room />} />
        <Route path="/test/:meetingId" element={<Layout />} />
        <Route path="/new" element={<Test1 />} />
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
    // </VideoProvider>
  );
}

export default App;
