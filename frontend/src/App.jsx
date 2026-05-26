import { Link, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FocusMode from "./pages/FocusMode";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-screen bg-[#F8F3EA] flex flex-col">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/focus/:taskId"
            element={
              <ProtectedRoute>
                <FocusMode />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A] flex items-center justify-center px-5">
                <div className="text-center rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-10 card-shadow max-w-md">
                  <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#295142] mb-3">
                    Page not found
                  </p>

                  <h1 className="font-display text-7xl mb-4">404</h1>

                  <p className="text-[#6F675D] leading-7 mb-7">
                    The page you are trying to open does not exist or may have
                    been moved.
                  </p>

                  <Link
                    to="/"
                    className="inline-flex rounded-full bg-[#1F1D1A] px-6 py-3 text-white font-extrabold hover:bg-[#295142] transition"
                  >
                    Go Home
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />

      <ToastContainer position="top-right" theme="light" autoClose={2500} />
    </div>
  );
};

export default App;