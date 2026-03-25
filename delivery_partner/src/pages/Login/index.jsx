import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/delivery/login", loginData, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem("deliveryToken", response.data.token);
      localStorage.setItem("deliveryId", response.data.id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-red-gradient flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-2xl">local_shipping</span>
          </div>
        </div>

        <h1 className="mb-1 text-center text-3xl font-bold text-gray-900">flowerKart</h1>
        <p className="mb-6 text-center text-sm text-gray-400 font-medium uppercase tracking-widest">
          Delivery Partner Portal
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              value={loginData.email}
              onChange={onChange}
              placeholder="you@example.com"
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              value={loginData.password}
              onChange={onChange}
              placeholder="••••••••"
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div className="flex justify-end">
            <span className="cursor-pointer text-sm text-gray-500 hover:text-red-600 hover:underline transition">
              Forgot password?
            </span>
          </div>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="mt-2 rounded-2xl bg-red-gradient py-3 text-white font-semibold transition-all duration-200 hover:scale-105 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-400">
            New delivery partner?{" "}
            <span
              className="cursor-pointer font-semibold text-red-600 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;