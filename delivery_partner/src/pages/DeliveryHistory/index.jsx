import { useState, useEffect } from "react";
import axios from "axios";

export const DeliveryHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const deliveryId = localStorage.getItem("deliveryId");
    try {
      const response = await axios.get(`http://localhost:8080/api/delivery/history/${deliveryId}`);
      setHistory(response.data);
      const total = response.data.reduce((sum, h) => sum + (h.deliveryFee || 0), 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error("Failed to fetch delivery history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((entry) => {
    if (searchId && !(entry.id || "").toLowerCase().includes(searchId.toLowerCase())) return false;
    if (fromDate && entry.date < fromDate) return false;
    if (toDate && entry.date > toDate) return false;
    return true;
  });

  const groupedHistory = filteredHistory.reduce((acc, entry) => {
    acc[entry.date] = acc[entry.date] || [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Delivery History</h1>
            <p className="text-gray-400 text-sm mt-1">All your completed deliveries and earnings</p>
          </div>
          <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 text-right">
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total Earned</p>
            <p className="text-2xl font-black text-gray-900">₹{totalEarnings}</p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Deliveries</p>
            <p className="text-2xl font-black text-gray-900">{history.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">This Month</p>
            <p className="text-2xl font-black text-gray-900">
              {history.filter(h => {
                const d = new Date(h.date);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 col-span-2 md:col-span-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Per Delivery</p>
            <p className="text-2xl font-black text-gray-900">
              ₹{history.length > 0 ? Math.round(totalEarnings / history.length) : 0}
            </p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">Search Order ID</label>
            <input
              type="text" placeholder="ORD-XXXXX" value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">From Date</label>
            <input
              type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">To Date</label>
            <input
              type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {/* HISTORY LIST */}
        {history.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-200">
            <div className="text-gray-300 text-7xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800">No deliveries yet</h3>
            <p className="text-gray-400 mt-2">Your completed deliveries will appear here.</p>
          </div>
        ) : (
          Object.keys(groupedHistory).sort((a, b) => new Date(b) - new Date(a)).map((date) => (
            <div key={date} className="mb-10">
              {/* DATE DIVIDER */}
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-100">
                  {new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              <div className="grid gap-4">
                {groupedHistory[date].map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all border border-gray-50"
                  >
                    {/* ICON + ORDER ID */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">{entry.time || "—"}</p>
                        <h3 className="text-sm font-bold text-gray-800">{entry.id}</h3>
                      </div>
                    </div>

                    {/* CUSTOMER */}
                    <div className="flex-1 w-full md:w-auto">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Customer</p>
                      <p className="font-semibold text-gray-700">{entry.customer || "Customer"}</p>
                    </div>

                    {/* ITEMS COUNT */}
                    <div className="w-full md:w-auto text-center md:text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Items</p>
                      <p className="font-bold text-gray-800">{(entry.items || []).length} item(s)</p>
                    </div>

                    {/* EARNINGS */}
                    <div className="w-full md:w-auto text-center md:text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Earned</p>
                      <p className="text-lg font-black text-gray-900">₹{entry.deliveryFee || 0}</p>
                    </div>

                    {/* STATUS BADGE */}
                    <div className="flex-shrink-0">
                      <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-green-50 text-green-600 border border-green-100">
                        Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
