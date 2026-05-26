import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router";
import {
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Menu,
  TimerReset,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isFocus = location.pathname.startsWith("/focus");

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };

  const handlePublicSectionClick = (sectionId) => {
    setMobileOpen(false);

    if (isHome) {
      const element = document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth"
        });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth"
          });
        }
      }, 100);
    }
  };

  return (
    <header className="w-full bg-[#F8F3EA]/90 backdrop-blur-md border-b border-[#DED2C0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="h-10 w-10 rounded-full bg-[#1F1D1A] text-white flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-extrabold tracking-tight text-[#1F1D1A]">
              TaskPilot
            </h1>
            <p className="text-xs text-[#6F675D] font-medium">
              Work made clearer
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#6F675D]">
          {!user && (
            <>
              <button
                onClick={() => handlePublicSectionClick("features")}
                className="hover:text-[#1F1D1A] transition"
              >
                Features
              </button>

              <button
                onClick={() => handlePublicSectionClick("workflow")}
                className="hover:text-[#1F1D1A] transition"
              >
                Workflow
              </button>

              <button
                onClick={() => handlePublicSectionClick("preview")}
                className="hover:text-[#1F1D1A] transition"
              >
                Preview
              </button>
            </>
          )}

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`hover:text-[#1F1D1A] transition ${
                  isDashboard ? "text-[#1F1D1A]" : ""
                }`}
              >
                Dashboard
              </Link>

              <span
                className={`${
                  isFocus ? "text-[#1F1D1A]" : "text-[#6F675D]"
                }`}
              >
                Focus Mode
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-[#1F1D1A]">{user.name}</p>
                <p className="text-xs text-[#6F675D]">Signed in</p>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 rounded-full border border-[#D9CCB8] bg-white px-4 py-2 text-sm font-bold text-[#1F1D1A] hover:bg-[#F1E7D8] transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-bold text-[#1F1D1A] hover:bg-[#EFE7D8] transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hidden sm:inline-flex rounded-full bg-[#1F1D1A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#295142] transition"
              >
                Get Started
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden h-10 w-10 rounded-full border border-[#D9CCB8] bg-white flex items-center justify-center"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#DED2C0] bg-[#FFFDF8] px-5 py-4">
          {!user ? (
            <div className="space-y-3">
              <button
                onClick={() => handlePublicSectionClick("features")}
                className="w-full text-left rounded-2xl bg-[#F8F3EA] px-4 py-3 font-bold text-[#1F1D1A]"
              >
                Features
              </button>

              <button
                onClick={() => handlePublicSectionClick("workflow")}
                className="w-full text-left rounded-2xl bg-[#F8F3EA] px-4 py-3 font-bold text-[#1F1D1A]"
              >
                Workflow
              </button>

              <button
                onClick={() => handlePublicSectionClick("preview")}
                className="w-full text-left rounded-2xl bg-[#F8F3EA] px-4 py-3 font-bold text-[#1F1D1A]"
              >
                Preview
              </button>

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl bg-[#F8F3EA] px-4 py-3 font-bold text-[#1F1D1A]"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block rounded-2xl bg-[#1F1D1A] px-4 py-3 font-bold text-white text-center"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-2xl bg-[#F8F3EA] px-4 py-3 font-bold text-[#1F1D1A]"
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <div className="flex items-center gap-2 rounded-2xl bg-[#F8F3EA] px-4 py-3 font-bold text-[#1F1D1A]">
                <TimerReset size={17} />
                Open focus from a task
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1F1D1A] px-4 py-3 font-bold text-white"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;