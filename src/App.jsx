// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameDetails from "./pages/GameDetails";
import SyncManualGames from "./pages/SyncManualGames";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/:iurl" element={<GameDetails />} />
        <Route path="/tools/sync-manual-games" element={<SyncManualGames />} />
      </Routes>
    </Router>
  );
}
