import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

type Ticket = {
  _id: string
  title: string
  status: string
  priority: string
  createdAt: string
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 })
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/tickets`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) navigate("/login")
        return
      }
      const data = await res.json()
      setStats({
        total: data.length,
        open: data.filter((t: any) => t.status === "Open").length,
        resolved: data.filter((t: any) => t.status === "Resolved").length
      })
      setRecentTickets(data.slice(0, 5))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="pt-32 text-center">Loading Dashboard...</div>

  return (
    <div className="pt-32 pb-16 px-16 bg-[#f7f9fb] min-h-screen">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-4xl text-[#070235] font-serif font-bold mb-10">Control Center Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#c8c5d0]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Volume</p>
            <p className="text-4xl font-bold text-[#070235]">{stats.total}</p>
            <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-[#070235] h-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#c8c5d0]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">High Priority / Open</p>
            <p className="text-4xl font-bold text-blue-600">{stats.open}</p>
            <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full" style={{ width: `${(stats.open/stats.total)*100}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#c8c5d0]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Resolution Rate</p>
            <p className="text-4xl font-bold text-green-600">{Math.round((stats.resolved / stats.total) * 100) || 0}%</p>
            <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="bg-green-600 h-full" style={{ width: `${(stats.resolved/stats.total)*100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#c8c5d0]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#070235]">Recent Tickets</h3>
              <button onClick={() => navigate("/admin")} className="text-xs font-bold text-[#7C3AED] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {recentTickets.map(ticket => (
                <div key={ticket._id} className="flex justify-between items-center p-4 bg-[#f7f9fb] rounded-xl border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-[#070235]">{ticket.title}</p>
                    <p className="text-[10px] text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${ticket.status === 'Open' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#070235] p-8 rounded-2xl shadow-sm text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-serif mb-4">Staff Quick Actions</h3>
               <p className="text-white/60 text-sm mb-8">Manage critical issues and update clients in real-time.</p>
               <div className="space-y-3">
                  <button onClick={() => navigate("/admin")} className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left flex justify-between items-center group transition-all">
                    <span className="text-sm font-bold text-[#D4AF37]">Batch Status Update</span>
                    <span className="material-symbols-outlined text-[#D4AF37] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </button>
                  <button onClick={() => navigate("/admin")} className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl text-left flex justify-between items-center group transition-all">
                    <span className="text-sm font-bold text-[#D4AF37]">Priority Backlog</span>
                    <span className="material-symbols-outlined text-[#D4AF37] group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </button>
               </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
