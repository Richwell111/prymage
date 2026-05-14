import { useState } from "react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setSubmitted(true)
      } else {
        const data = await response.json()
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
      <div className="pt-40 pb-20 px-6 flex justify-center bg-[#f7f9fb] min-h-screen w-full">
        <div className="w-full max-w-md text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
            </div>
          </div>
          <h2 className="text-3xl font-serif text-[#070235] mb-4">Ticket Submitted!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">We've received your request. Our support team will review it and contact you shortly.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-[#070235] text-white py-4 rounded-xl font-bold hover:bg-[#1E1B4B] transition-all"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-40 pb-20 px-6 bg-[#f7f9fb] min-h-screen w-full">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#712ae2]/5 px-4 py-2 rounded-full mb-6 border border-[#712ae2]/10">
            <span className="material-symbols-outlined text-[#712ae2] text-sm">support_agent</span>
            <span className="text-[#712ae2] text-[10px] font-bold uppercase tracking-widest">Prymage Help Center</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#070235] mb-6 leading-tight">
            How can we <span className="text-[#7C3AED] italic">help you?</span>
          </h1>
          <p className="text-[#475569] text-xl max-w-lg mx-auto leading-relaxed">
            Submit a ticket and our experts will get back to you within 24 hours.
          </p>
        </div>

        {/* Card Form */}
        <div className="w-full max-w-2xl bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/60 border border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7C3AED]/5 to-transparent rounded-full -mr-16 -mt-16"></div>
          
          <h2 className="text-3xl font-serif text-[#070235] mb-12 flex items-center gap-3">
            <span className="w-8 h-1 bg-[#D4AF37] rounded-full"></span>
            Ticket Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-[#070235] uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input 
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all"
                  required 
                  placeholder="e.g. John Doe" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-[#070235] uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input 
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all"
                  type="email" 
                  required 
                  placeholder="e.g. name@company.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#070235] uppercase tracking-[0.2em] ml-1">Type of Issue</label>
              <input 
                className="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all"
                required 
                placeholder="e.g. ERPNext Implementation, GRA E-VAT Connector" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#070235] uppercase tracking-[0.2em] ml-1 text-center block">Priority Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                      formData.priority === p 
                        ? 'bg-[#070235] text-white border-[#070235] shadow-lg shadow-[#070235]/20' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#070235] uppercase tracking-[0.2em] ml-1">Message Description</label>
              <textarea 
                className="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all min-h-[160px] resize-none"
                required 
                placeholder="Explain your problem in detail..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#070235] text-white py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#1E1B4B] hover:shadow-2xl hover:translate-y-[-2px] active:translate-y-0 active:shadow-lg disabled:opacity-50 transition-all shadow-xl shadow-[#070235]/20"
              disabled={loading}
            >
              {loading ? "Creating Ticket..." : "Submit Support Request"}
            </button>
          </form>
        </div>
        
        {/* Footer info */}
        <div className="mt-12 flex gap-10 text-gray-400">
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encryption</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">GRA Verified Support</span>
           </div>
        </div>
      </div>
    </div>
  )
}
