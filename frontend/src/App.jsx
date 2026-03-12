import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Scoreboard from "./pages/Scoreboard"
import ScoreEntry from "./pages/ScoreEntry"
import AdminLogin from "./pages/AdminLogin"

function App() {

  return (
    <div className="app-bg min-h-screen text-white">

      <Routes>

        <Route path="/" element={<Scoreboard />} />

        <Route path="/login" element={<Login />} />

        <Route path="/score-entry" element={<ScoreEntry />} />

        <Route path="/admin" element={<AdminLogin />} />

      </Routes>

    </div>
  )

}

export default App