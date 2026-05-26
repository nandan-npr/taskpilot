import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ArrowRight, ShieldCheck } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await API.post("/auth/register", formData);

      login(response.data.token, response.data.user);

      toast.success("Workspace created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#1F1D1A]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <section className="max-w-md w-full mx-auto lg:mx-0">
            <div className="rounded-[2rem] bg-[#FFFDF8] border border-[#D8C9B3] p-7 sm:p-9 soft-shadow">
              <div className="mb-8">
                <p className="text-sm font-extrabold text-[#295142] mb-2">
                  Create workspace
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Start with a clean board
                </h2>
                <p className="text-[#6F675D] mt-2">
                  Create your account and begin organizing tasks clearly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-[#1F1D1A]">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#1F1D1A]">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-[#1F1D1A]">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full mt-2 rounded-2xl border border-[#D8C9B3] bg-white px-4 py-3.5 outline-none focus:border-[#295142] transition"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#1F1D1A] py-4 text-white font-extrabold hover:bg-[#295142] disabled:opacity-60 transition flex items-center justify-center gap-2"
                >
                  {loading ? "Creating workspace..." : "Create account"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <p className="text-center text-sm text-[#6F675D] mt-7">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-extrabold text-[#295142] hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </section>

          <section className="hidden lg:block">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#295142]">
              Designed for clarity
            </p>

            <h1 className="font-display text-6xl leading-tight mt-4">
              A workspace that users understand instantly.
            </h1>

            <p className="text-[#6F675D] text-lg leading-8 mt-6 max-w-xl">
              No complicated menus. No confusing setup. Just a clean task board
              with smart information where users need it.
            </p>

            <div className="mt-8 rounded-3xl border border-[#D8C9B3] bg-white p-6 max-w-md card-shadow">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#295142] text-white flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-extrabold">Private by default</h3>
                  <p className="text-sm text-[#6F675D]">
                    Every user sees only their own tasks.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Register;