import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, Gamepad2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import API from "../services/api";

const LeaderboardPage = () => {

const navigate = useNavigate();

const [activeGame,setActiveGame] = useState("NFS");
const [leaderboardData,setLeaderboardData] = useState([]);
const [prevWinner,setPrevWinner] = useState(null);

const games = [
{ id:"NFS", name:"NFS", scoreType:"time"},
{ id:"ALTOS", name:"Altos Adventure", scoreType:"score"},
{ id:"ULTRAKILL", name:"ULTRAKILL", scoreType:"rank"}
];


// Fetch leaderboard from backend
useEffect(()=>{

loadScores();

const interval = setInterval(loadScores,3000);

return ()=>clearInterval(interval);

},[activeGame]);


async function loadScores(){

try{

const res = await API.get("/scores/leaderboard");

const allScores = res.data;

const filtered = allScores
.filter(s=>s.game === activeGame)
.sort((a,b)=>b.score - a.score)
.slice(0,5)
.map((player,index)=>({
rank:index+1,
name:player.playerName,
srn:player.srn,
score:player.score
}));

const currentWinner = filtered[0]?.name;

if(currentWinner && prevWinner && currentWinner !== prevWinner){
triggerConfetti();
}

setLeaderboardData(filtered);
setPrevWinner(currentWinner);

}catch(err){

console.error("Error loading leaderboard",err);

}

}


const triggerConfetti = () => {

confetti({
particleCount:120,
spread:80,
origin:{y:0.6},
colors:["#7B3FE4","#FF4FD8","#00E5FF"]
});

};


const getMedalIcon = (rank) => {

switch(rank){

case 1:
return <Crown className="w-6 h-6 text-yellow-400"/>;

case 2:
return <Medal className="w-6 h-6 text-gray-300"/>;

case 3:
return <Trophy className="w-6 h-6 text-amber-600"/>;

default:
return <div className="w-6 h-6 flex items-center justify-center text-[#E6E8FF] font-bold">{rank}</div>;

}

};


return (

<div className="min-h-screen bg-gradient-to-br from-[#0B0F2F] via-[#0F1B4A] to-[#0B0F2F]">

<div className="p-4 min-h-screen">

{/* Header */}

<div className="max-w-4xl mx-auto mb-8">

<button
onClick={()=>navigate("/")}
className="text-[#00E5FF] flex items-center mb-4"
>

<ArrowLeft className="w-5 h-5 mr-2"/>
Back

</button>


<h1 className="text-5xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8]">

LIVE ARCADE LEADERBOARD

</h1>

<p className="text-center text-[#00E5FF] mt-2">

<Gamepad2 className="inline mr-2"/>
Real-time Rankings

</p>

</div>


{/* Game Tabs */}

<div className="max-w-4xl mx-auto mb-6 flex justify-center space-x-3">

{games.map(game=>(
<button
key={game.id}
onClick={()=>setActiveGame(game.id)}
className={`px-4 py-2 rounded ${
activeGame===game.id
? "bg-gradient-to-r from-[#7B3FE4] to-[#FF4FD8]"
: "bg-[#151A3F]"
}`}
>
{game.name}
</button>
))}

</div>


{/* Leaderboard */}

<div className="max-w-4xl mx-auto bg-[#151A3F] rounded-xl p-6 border border-[#7B3FE4]">

<div className="grid grid-cols-12 mb-4 text-[#00E5FF]">

<div className="col-span-2 text-center">Rank</div>
<div className="col-span-4">Player</div>
<div className="col-span-3">SRN</div>
<div className="col-span-3 text-right">Score</div>

</div>


<AnimatePresence>

{leaderboardData.map((player,index)=>(

<motion.div
key={player.rank}
className="grid grid-cols-12 py-3 border-b border-[#7B3FE4]/20"
initial={{opacity:0,x:-50}}
animate={{opacity:1,x:0}}
transition={{delay:index*0.1}}
>

<div className="col-span-2 flex justify-center">
{getMedalIcon(player.rank)}
</div>

<div className="col-span-4 font-bold text-white">
{player.name}
</div>

<div className="col-span-3 text-[#00E5FF]">
{player.srn}
</div>

<div className="col-span-3 text-right text-[#FF4FD8] font-bold">
{player.score}
</div>

</motion.div>

))}

</AnimatePresence>

</div>


<div className="text-center mt-6 text-[#E6E8FF]/70">

Last updated: {new Date().toLocaleTimeString()}

</div>

</div>

</div>

);

};

export default LeaderboardPage;