import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Lock, User, AlertCircle } from "lucide-react";
import API from "../services/api";

export default function Login(){

const navigate = useNavigate();

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);

async function handleLogin(e){

e.preventDefault();
setError("");
setIsLoading(true);

try{

const res = await API.post("/auth/terminal/login",{
username,
password
});

// Store token in localStorage
localStorage.setItem("token", res.data.token);
localStorage.setItem("username", res.data.username);
localStorage.setItem("role", res.data.role);

navigate("/submit-score");

}catch(err){
setError(err.response?.data?.error || "Login failed. Please check your credentials.");
}finally{
setIsLoading(false);
}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F]">

<div className="w-full max-w-md">

<form onSubmit={handleLogin} className="bg-[#151A3F] p-8 rounded-xl border border-[#7B3FE4]/50">

<div className="flex items-center justify-center mb-6">
<Terminal className="w-8 h-8 text-[#FF4FD8] mr-3" />
<h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8]">
Terminal Login
</h2>
</div>

<p className="text-center text-[#00E5FF] mb-6 text-sm">
Access the score submission terminal
</p>

{error && (
<div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-start">
<AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
<span className="text-red-200 text-sm">{error}</span>
</div>
)}

<div className="mb-4">
<label className="block text-[#00E5FF] text-sm mb-2">Username</label>
<div className="flex items-center bg-[#0B0F2F] rounded border border-[#7B3FE4]/30">
<User className="w-5 h-5 text-[#00E5FF] ml-3" />
<input
type="text"
placeholder="terminal1"
className="w-full ml-2 p-3 bg-transparent outline-none text-white placeholder-[#7B3FE4]/50"
value={username}
onChange={(e)=>setUsername(e.target.value)}
disabled={isLoading}
/>
</div>
</div>

<div className="mb-6">
<label className="block text-[#00E5FF] text-sm mb-2">Password</label>
<div className="flex items-center bg-[#0B0F2F] rounded border border-[#7B3FE4]/30">
<Lock className="w-5 h-5 text-[#00E5FF] ml-3" />
<input
type="password"
placeholder="••••••••"
className="w-full ml-2 p-3 bg-transparent outline-none text-white placeholder-[#7B3FE4]/50"
value={password}
onChange={(e)=>setPassword(e.target.value)}
disabled={isLoading}
/>
</div>
</div>

<button 
className="w-full bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8] p-3 rounded font-bold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
disabled={isLoading}
>
{isLoading ? "Logging in..." : "Login"}
</button>

<div className="mt-4 p-3 bg-[#0B0F2F] rounded text-xs text-[#00E5FF]">
<p className="font-bold mb-2">Demo Credentials:</p>
<p>terminal1 / terminal1</p>
<p>terminal2 / terminal2</p>
<p>terminal3 / terminal3</p>
</div>

</form>

</div>

</div>

)

}