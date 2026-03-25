import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicleNumber: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTnC, setShowTnC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signupData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/delivery/signup", signupData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(response.data.message || "Registration successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg relative">

        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-2xl bg-red-gradient flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">delivery_dining</span>
          </div>
        </div>

        <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">Join as Delivery Partner</h1>
        <p className="mb-6 text-center text-sm text-gray-400">flowerKart Delivery Network</p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text" name="name" placeholder="John Doe" onChange={onChange}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input
              type="email" name="email" placeholder="you@example.com" onChange={onChange}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Phone</label>
              <input
                type="tel" name="phone" placeholder="+91 98765 43210" onChange={onChange}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Vehicle No.</label>
              <input
                type="text" name="vehicleNumber" placeholder="MH 01 AB 1234" onChange={onChange}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password" name="password" placeholder="Create a strong password"
              onChange={(e) => { setSignupData({ ...signupData, password: e.target.value }); }}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password" placeholder="Re-enter password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-red-600"
            />
            <p>
              I agree to the{" "}
              <span onClick={() => setShowTnC(true)} className="cursor-pointer font-semibold text-red-600 hover:underline">
                Terms & Conditions
              </span>
            </p>
          </div>

          <button
            disabled={!agreed || loading}
            onClick={handleSubmit}
            className={`mt-2 rounded-2xl py-3 text-white font-semibold transition-all duration-200 shadow-lg
              ${agreed ? "bg-red-gradient hover:scale-105 hover:opacity-90 active:scale-95" : "bg-gray-300 cursor-not-allowed"}`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already registered?{" "}
            <span onClick={() => navigate("/")} className="cursor-pointer font-semibold text-red-600 hover:underline">
              Login
            </span>
          </p>
        </div>

        {/* TERMS MODAL */}
        {showTnC && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Terms & Conditions</h2>
              <div className="max-h-64 overflow-y-auto text-sm text-gray-600 space-y-3">
                <p>By registering as a delivery partner on flowerKart, you agree to the following:</p>
                <p>• You are responsible for safe and timely delivery of all packages.<br />
                   • You must maintain your vehicle and carry valid license documents.<br />
                   • Orders once accepted must be delivered within the specified time window.<br />
                   • Any misuse or fraudulent activity may result in immediate account suspension.</p>
                <p>These terms may be updated at any time without prior notice.</p>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowTnC(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Close</button>
                <button onClick={() => { setAgreed(true); setShowTnC(false); }} className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900">I Agree</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
