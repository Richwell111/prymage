import { useState } from "react"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    priority: "Low",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        setSubmitted(true)
      } else {
        alert(data.message || "Something went wrong")
      }
    } catch (error) {
      console.error("Failed to submit ticket", error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="pt-32 pb-16 flex justify-center">
        <div className="w-full max-w-md text-center bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center mb-4">
            <span className="material-symbols-outlined text-green-500 text-6xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-[#070235] mb-2">Ticket Submitted!</h2>
          <p className="text-gray-600 mb-6">We've received your request and will get back to you soon.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-[#070235] text-white px-8 py-3 rounded font-bold hover:bg-[#1E1B4B]"
          >
            Submit Another Ticket
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-16 px-6 bg-[#f7f9fb] min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#070235] mb-4">Customer Support</h1>
          <p className="text-[#475569]">Prymage Help Center. Fill out the form below to open a support ticket.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl border border-[#c8c5d0]">
          <h2 className="text-2xl font-serif text-[#070235] mb-6">Open a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#070235] uppercase">Full Name *</label>
                <input 
                  className="w-full border border-[#c8c5d0] rounded p-3 focus:ring-1 focus:ring-[#7C3AED] outline-none"
                  required 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#070235] uppercase">Email Address *</label>
                <input 
                  className="w-full border border-[#c8c5d0] rounded p-3 focus:ring-1 focus:ring-[#7C3AED] outline-none"
                  type="email" 
                  required 
                  placeholder="john@company.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest">Type of Issue *</label>
              <input 
                className="w-full border border-[#c8c5d0] rounded-xl p-4 focus:ring-1 focus:ring-[#7C3AED] outline-none transition-all"
                required 
                placeholder="e.g. ERP Implementation, Accounting Error" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#070235] uppercase">Priority *</label>
              <select 
                className="w-full border border-[#c8c5d0] rounded p-3 focus:ring-1 focus:ring-[#7C3AED] outline-none bg-white"
                value={formData.priority} 
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#070235] uppercase">Description *</label>
              <textarea 
                className="w-full border border-[#c8c5d0] rounded p-3 focus:ring-1 focus:ring-[#7C3AED] outline-none"
                required 
                placeholder="Describe your problem in detail" 
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#070235] text-white py-4 rounded font-bold hover:bg-[#1E1B4B] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
