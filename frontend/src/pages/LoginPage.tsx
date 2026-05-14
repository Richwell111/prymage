import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("role", data.role)
        localStorage.setItem("userId", data.userId)
        
        // Redirect based on role
        if (data.role === "admin" || data.role === "staff") {
          navigate("/dashboard")
        } else {
          navigate("/")
        }
      } else {
        setError(data.message || "Invalid credentials")
      }
    } catch (err) {
      setError("Failed to connect to the server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-16 px-6 bg-[#f7f9fb] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-[#c8c5d0]">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif text-[#070235] mb-2">Login</h1>
          <p className="text-[#475569] text-sm">Access the PRYMAGE Control Center</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-xs font-bold mb-6 border border-red-100 uppercase tracking-wider">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest">Email Address</label>
            <input 
              className="w-full border border-[#c8c5d0] rounded-xl p-4 focus:ring-1 focus:ring-[#7C3AED] outline-none transition-all"
              type="email"
              required 
              placeholder="admin@prymage.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#070235] uppercase tracking-widest">Password</label>
            <input 
              className="w-full border border-[#c8c5d0] rounded-xl p-4 focus:ring-1 focus:ring-[#7C3AED] outline-none transition-all"
              type="password"
              required 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#070235] text-white py-4 rounded-xl font-bold hover:bg-[#1E1B4B] disabled:opacity-50 transition-all shadow-lg shadow-[#070235]/10"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Forgot password? Contact system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
