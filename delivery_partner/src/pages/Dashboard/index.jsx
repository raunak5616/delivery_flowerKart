import { useNavigate } from "react-router-dom";

const statCards = [
  {
    label: "Assigned Today",
    value: "0",
    icon: "package_2",
    gradient: "linear-gradient(135deg, #22c55e 0%, #bbf7d0 100%)",
    textColor: "#064e3b",
    route: "/live-orders",
  },
  {
    label: "In Transit",
    value: "0",
    icon: "local_shipping",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #bfdbfe 100%)",
    textColor: "#1e3a8a",
    route: "/live-orders",
  },
  {
    label: "Delivered",
    value: "0",
    icon: "check_circle",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ddd6fe 100%)",
    textColor: "#312e81",
    route: "/history",
  },
  {
    label: "Earnings Today",
    value: "₹0",
    icon: "payments",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #93c5fd 100%)",
    textColor: "#0f172a",
    route: "/history",
  },
];

const quickActions = [
  { label: "Live Orders", icon: "inbox", route: "/live-orders", desc: "View & pick up new orders" },
  { label: "Delivery History", icon: "history", route: "/history", desc: "See past deliveries & earnings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const partnerId = localStorage.getItem("deliveryId") || "---";

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Delivery Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back! Here's your overview for today.</p>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
            <div className="h-9 w-9 rounded-xl bg-red-gradient flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-base">person</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partner ID</p>
              <p className="text-xs font-bold text-gray-700 font-mono">DP-{partnerId.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((card) => (
            <div
              key={card.label}
              onClick={() => navigate(card.route)}
              style={{ background: card.gradient, color: card.textColor }}
              className="rounded-3xl p-6 cursor-pointer shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <span className="material-symbols-outlined text-3xl mb-3 block opacity-80">{card.icon}</span>
              <p className="text-2xl font-black">{card.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider opacity-70 mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-10">
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Quick Actions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quickActions.map((action) => (
              <div
                key={action.label}
                onClick={() => navigate(action.route)}
                className="bg-white rounded-2xl p-6 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md border border-gray-100 group transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-gradient transition-all">
                  <span className="material-symbols-outlined text-red-500 group-hover:text-white transition-colors">{action.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">{action.label}</h3>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </div>
                <span className="material-symbols-outlined text-gray-300 ml-auto group-hover:text-red-400 transition-colors">arrow_forward_ios</span>
              </div>
            ))}
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
          <p className="text-sm font-semibold text-gray-600">You are <span className="text-green-600 font-bold">Active</span> and ready to receive delivery assignments.</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
