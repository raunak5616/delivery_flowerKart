import { useState, useEffect } from "react";
import axios from "axios";

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const deliveryId = localStorage.getItem("deliveryId");
    try {
      const response = await axios.get(`http://localhost:8080/api/delivery/orders/${deliveryId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch delivery orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:8080/api/delivery/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert("Failed to update delivery status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Assigned") return order.status === "Shipped";
    return order.status === filterStatus;
  });

  const statusConfig = {
    Shipped: { label: "Assigned", dot: "bg-orange-500 animate-pulse", badge: "bg-orange-100 text-orange-700" },
    "Out for Delivery": { label: "Out for Delivery", dot: "bg-blue-500 animate-pulse", badge: "bg-blue-100 text-blue-700" },
    Delivered: { label: "Delivered", dot: "bg-green-500", badge: "bg-green-100 text-green-700" },
  };

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
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Live Orders</h1>
            <p className="text-gray-400 text-sm mt-1">Pick up and deliver your assigned orders</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border">
            {["All", "Assigned", "Out for Delivery"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === status
                    ? "bg-red-gradient text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ORDER COUNT BADGE */}
        <div className="flex gap-3 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-600">{orders.filter(o => o.status === "Shipped").length} Assigned</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
            <span className="text-xs font-bold text-gray-600">{orders.filter(o => o.status === "Out for Delivery").length} In Transit</span>
          </div>
        </div>

        {/* ORDERS LIST */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-dashed border-gray-200">
            <div className="text-gray-300 text-7xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-gray-800">No {filterStatus.toLowerCase()} orders</h3>
            <p className="text-gray-400 mt-2">New delivery assignments will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredOrders.map((order) => {
              const cfg = statusConfig[order.status] || { label: order.status, dot: "bg-gray-400", badge: "bg-gray-100 text-gray-600" };
              return (
                <div key={order._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100">

                  {/* ORDER HEADER */}
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${cfg.dot}`}></div>
                      <span className="font-bold text-gray-700">Order #{(order.razorpay_order_id || order._id).slice(-8).toUpperCase()}</span>
                      <span className="text-xs text-gray-400">| {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* ORDER CONTENT */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">

                      {/* ITEMS */}
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest">Order Items</p>
                        <div className="space-y-3">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <img
                                src={item.images?.[0]?.url || item.image || "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=100"}
                                className="h-11 w-11 rounded-lg object-cover border"
                                alt=""
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-800">{item.name || item.title}</h4>
                                <p className="text-xs text-gray-400">Qty: {item.qty || 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8">
                        <div className="mb-4">
                          <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Delivery Address</p>
                          <p className="text-sm font-semibold text-gray-700">{order.address || "Address will appear here"}</p>
                          {order.customerPhone && (
                            <p className="text-xs text-gray-400 mt-1">📞 {order.customerPhone}</p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          {order.status === "Shipped" && (
                            <button
                              onClick={() => updateStatus(order.razorpay_order_id || order._id, "Out for Delivery")}
                              className="flex-1 bg-black text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">directions_bike</span>
                              Pick Up & Start Delivery
                            </button>
                          )}
                          {order.status === "Out for Delivery" && (
                            <button
                              onClick={() => updateStatus(order.razorpay_order_id || order._id, "Delivered")}
                              className="flex-1 bg-green-gradient text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                              Mark as Delivered
                            </button>
                          )}
                          {order.status === "Delivered" && (
                            <div className="flex-1 bg-green-50 text-green-700 py-3 rounded-xl text-sm font-bold border border-green-100 flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-lg">verified</span>
                              Delivery Complete
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveOrders;
