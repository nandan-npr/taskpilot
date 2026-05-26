import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A] flex items-center justify-center px-5">
        <div className="text-center rounded-[2rem] border border-[#D8C9B3] bg-[#FFFDF8] p-8 card-shadow">
          <div className="h-12 w-12 rounded-full border-4 border-[#D8C9B3] border-t-[#295142] animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-extrabold">Opening your workspace</h2>
          <p className="text-sm text-[#6F675D] mt-2">
            Checking your secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;