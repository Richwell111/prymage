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
      <div className="pt-40 pb-20 px-6 flex justify-center bg-[#f7f9fb] min-h-screen">
        <div className="w-full max-w-md text-center bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
            </div>
          </div>
          <h2 className="text-3xl font-serif text-[#070235] mb-4">Ticket Submitted!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">We've received your request. Our support team will review it and contact you via email shortly.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-[#070235] text-white py-4 rounded-xl font-bold hover:bg-[#1E1B4B] transition-all shadow-lg"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-40 pb-20 px-6 bg-[#f7f9fb] min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 bg-[#712ae2]/5 px-4 py-2 rounded-full mb-6 border border-[#712ae2]/10">
          <span className="material-symbols-outlined text-[#712ae2] text-sm">support_agent</span>
          <span className="text-[#712ae2] text-[10px] font-bold uppercase tracking-widest">Prymage Help Center</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-serif text-[#070235] mb-6">How can we <span className="text-[#7C3AED] italic">help you?</span></h1>
        <p className="text-[#475569] text-lg max-w-lg mx-auto leading-relaxed">Fill out the detailed form below and our experts will get back to you within 24 hours.</p>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white relative">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#7C3AED]/5 rounded-full blur-3xl"></div>
        
        <h2 className="text-3xl font-serif text-[#070235] mb-10 pb-6 border-b border-gray-50">Ticket Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group space-y-2">
              <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest ml-1">Full Name *</label>
              <input 
                className="w-full bg-[#f8fafc] border border-transparent rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all placeholder:text-gray-300"
                required 
                placeholder="John Doe" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="group space-y-2">
              <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest ml-1">Email Address *</label>
              <input 
                className="w-full bg-[#f8fafc] border border-transparent rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all placeholder:text-gray-300"
                type="email" 
                required 
                placeholder="john@company.com" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest ml-1">Type of Issue *</label>
            <input 
              className="w-full bg-[#f8fafc] border border-transparent rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all placeholder:text-gray-300"
              required 
              placeholder="e.g. ERPNext Implementation, GRA E-VAT Connector" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest ml-1">Priority Level *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                    formData.priority === p 
                      ? 'bg-[#070235] text-white border-[#070235] shadow-md shadow-[#070235]/20' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-[#070235]/20'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest ml-1">Detailed Description *</label>
            <textarea 
              className="w-full bg-[#f8fafc] border border-transparent rounded-2xl p-5 focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/5 outline-none transition-all placeholder:text-gray-300 min-h-[150px]"
              required 
              placeholder="Please describe the issue, including any error codes..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#070235] text-white py-5 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-[#1E1B4B] hover:translate-y-[-2px] active:translate-y-[0px] disabled:opacity-50 transition-all shadow-xl shadow-[#070235]/20"
            disabled={loading}
          >
            {loading ? "Processing..." : "Create Support Ticket"}
          </button>
        </form>
      </div>
      
      <div className="mt-16 flex items-center gap-8 text-gray-400">
         <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Secure SSL Encryption</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter">GRA Compliant Support</span>
         </div>
      </div>
    </div>
  )
}
