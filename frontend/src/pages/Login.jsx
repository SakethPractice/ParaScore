import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login(){

const navigate = useNavigate();

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

async function handleLogin(e){

e.preventDefault();

try{

const res = await API.post("/auth/login",{
username,
password
});

if(res.data.role === "terminal"){
navigate("/submit-score");
}else{
alert("Not a terminal account");
}

}catch(err){
alert("Login failed");
}

}

return(

<div className="min-h-screen flex items-center justify-center bg-[#0B0F2F] text-white">

<form onSubmit={handleLogin} className="bg-[#151A3F] p-8 rounded-xl w-[350px]">

<h2 className="text-2xl mb-6 text-center">
Terminal Login
</h2>

<input
type="text"
placeholder="Username"
className="w-full mb-4 p-3 rounded bg-[#0B0F2F]"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full mb-6 p-3 rounded bg-[#0B0F2F]"
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="w-full bg-purple-600 p-3 rounded">
Login
</button>

</form>

</div>

)

}