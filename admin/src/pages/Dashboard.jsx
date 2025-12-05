import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiActivity, FiDollarSign, FiTrendingUp, FiZap } from "react-icons/fi";
import { useAuth } from "./AuthContext";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalVolume: 0,
    activeUsers: 0,
    tps: 0,
    systemHealth: 99.98, // This might be static or derived from other metrics
  });
  const [liveActivity, setLiveActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Optionally, set some default or error state
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [accessToken]);

  return (
    <div className="w-full">
      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12" 
        >
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-xl text-cyan-300 mt-3 font-light"> 
            Real-time metrics, balances & system health
          </p>
        </motion.div> 

        {/* KPI Cards – Matrix Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Volume", value: dashboardData.totalVolume, icon: FiDollarSign, color: "from-emerald-500 to-teal-600", prefix: "EMC " },
            { label: "Active Users", value: dashboardData.activeUsers, icon: FiActivity, color: "from-blue-500 to-cyan-600" },
            { label: "Transactions/s", value: dashboardData.tps, icon: FiZap, color: "from-purple-500 to-pink-600" },
            { label: "System Health", value: dashboardData.systemHealth, icon: FiTrendingUp, color: "from-green-500 to-lime-600", suffix: "%" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }} 
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-500"> 
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[1]}, transparent)` }}
                />
                <div className="relative z-10"> 
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="text-4xl text-cyan-400" /> 
                    <span className="text-3xl animate-pulse">▪</span> 
                  </div>
                  <p className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</p> 
                  <p className="text-4xl font-bold mt-2 font-mono">
                    {stat.prefix}
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </p>
                </div> 
                {/* Scanline effect on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 translate-y-[-100%] group-hover:translate-y-full animate-scan" />
              </div>
            </motion.div>
          ))} 
        </div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-black/40 backdrop-blur-2xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20" 
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-cyan-400 animate-pulse">◉</span> Live Activity Stream 
          </h2>
          <div className="space-y-4 font-mono text-sm">
            {liveActivity.length > 0 ? liveActivity.map((line, i) => (
              <motion.div
                key={i} // In a real app, use a unique ID from the activity object
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="text-green-400"
              >{line}</motion.div>
            )) : (
              <>
                <p className="text-gray-400">→ Payout 0x9f3a...c8e1 completed • +12,450.00 EMC</p>
                <p className="text-gray-400">→ Aggregator sync • KES → EMC rate updated</p>
                <p className="text-gray-400">→ User 3842 deposited 890,000 KES</p>
                <p className="text-gray-400">→ Reserve reconciliation • EMC balance OK</p>
                <p className="text-gray-400">→ High volume alert • TPS spike detected</p>
              </>
            )}
          </div>
        </motion.div>
      </div>

    </div> 
  );
}
