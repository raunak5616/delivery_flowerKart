import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../src/components/navbar";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Dashboard from "../src/pages/Dashboard";
import LiveOrders from "../src/pages/LiveOrders";
import DeliveryHistory from "../src/pages/DeliveryHistory";

const AppRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* Public routes - no navbar */}
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes - with navbar */}
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <Navbar />
                                <Dashboard />
                            </>
                        }
                    />
                    <Route
                        path="/live-orders"
                        element={
                            <>
                                <Navbar />
                                <LiveOrders />
                            </>
                        }
                    />
                    <Route
                        path="/history"
                        element={
                            <>
                                <Navbar />
                                <DeliveryHistory />
                            </>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default AppRouter;