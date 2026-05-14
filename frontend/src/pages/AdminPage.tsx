import { useState, useEffect } from "react"

type Ticket = {
  id: string
  _id: string
  name: string
  email: string
  title: string
  description: string
  priority: "Low" | "Medium" | "High" | "Critical"
  status: "Open" | "In Progress" | "Resolved"
  notes: { _id: string; text: string; createdAt: string }[]
  createdAt: string
}

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [noteText, setNoteText] = useState("")

  useEffect(() => {
    fetchTickets()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/tickets`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) {
        console.error(data.message)
        return
      }
      setTickets(data)
    } catch (e) {
      console.error("Fetch failed", e)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:5000/api/tickets/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    })
    fetchTickets()
  }

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket || !noteText) return
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:5000/api/tickets/${selectedTicket._id}/notes`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ text: noteText }),
    })
    setNoteText("")
    fetchTickets()
    // Refresh selected ticket view
    const updatedRes = await fetch("http://localhost:5000/api/tickets", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    const updatedData = await updatedRes.json()
    setSelectedTicket(updatedData.find((t: Ticket) => t._id === selectedTicket._id))
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "Critical": return "bg-red-600 text-white"
      case "High": return "bg-orange-500 text-white"
      case "Medium": return "bg-blue-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="pt-32 pb-16 px-16 bg-[#f7f9fb] min-h-screen">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl text-[#070235] font-bold font-serif">Admin Dashboard</h1>
          <div className="flex gap-4">
             <div className="px-6 py-4 bg-white rounded-lg shadow-sm border border-[#c8c5d0]">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Total Tickets</p>
                <p className="text-3xl font-bold text-[#070235]">{tickets.length}</p>
             </div>
             <div className="px-6 py-4 bg-white rounded-lg shadow-sm border border-[#c8c5d0]">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Open Items</p>
                <p className="text-3xl font-bold text-blue-600">{tickets.filter(t => t.status === 'Open').length}</p>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#c8c5d0] overflow-hidden">
          <div className="p-6 border-b border-[#c8c5d0] bg-gray-50">
            <h2 className="text-xl font-bold text-[#070235]">Active Support Tickets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map(ticket => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#070235]">{ticket.name}</p>
                      <p className="text-xs text-gray-500">{ticket.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#070235] max-w-xs truncate">{ticket.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={ticket.status} 
                        onChange={(e) => updateStatus(ticket._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 outline-none bg-white focus:ring-1 focus:ring-[#7C3AED]"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-xs font-bold text-[#7C3AED] hover:underline"
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-[#070235]">{selectedTicket.title}</h3>
              <button onClick={() => setSelectedTicket(null)} className="material-symbols-outlined text-gray-400 hover:text-red-500 transition-colors">close</button>
            </div>
            <div className="p-8 overflow-y-auto space-y-8 flex-1">
              <div className="bg-[#f7f9fb] p-6 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Original Request</p>
                <p className="text-sm text-[#070235] leading-relaxed">{selectedTicket.description}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-[#070235] flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#7C3AED]">chat</span>
                  Internal Communications ({selectedTicket.notes.length})
                </p>
                <div className="space-y-3">
                  {selectedTicket.notes.map(note => (
                    <div key={note._id} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                      <p className="text-xs text-[#070235]">{note.text}</p>
                      <p className="text-[10px] text-blue-400 mt-2 font-medium">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {selectedTicket.notes.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No notes added yet.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <form onSubmit={addNote} className="flex gap-3">
                <input 
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#7C3AED] outline-none"
                  placeholder="Add a reply or staff note..." 
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5a00c6] transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
